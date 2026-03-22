import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { Resend } from "npm:resend";
import { createClient } from "npm:@supabase/supabase-js";
import * as kv from "./kv_store.ts";
import Stripe from "npm:stripe";

// Initialize the Hono app
const app = new Hono();

// IMPORTANT: CORS must be the first middleware
app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'X-Client-Info', 'Apikey'],
  maxAge: 600,
}));

app.use('*', logger());

// Initialize services with environment variables
const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY") || "";
const STRIPE_WEBHOOK_SECRET = Deno.env.get("STRIPE_WEBHOOK_SECRET") || "";
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") || "";
const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: "2023-10-16" });
const resend = new Resend(RESEND_API_KEY);

const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const BUCKET_NAME = 'make-e62e42f7';

const normalizeString = (value: unknown): string | null => {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
};

const buildSafeProfile = (
  userId: string,
  existing: any = {},
  updates: any = {},
  fallbackEmail?: string | null
) => {
  const firstName = normalizeString(updates.firstName) ?? normalizeString(existing.firstName);
  const lastName = normalizeString(updates.lastName) ?? normalizeString(existing.lastName);

  const fallbackName = [firstName, lastName].filter(Boolean).join(' ').trim();

  const computedName =
    normalizeString(updates.name) ??
    normalizeString(existing.name) ??
    (fallbackName || null);

  return {
    userId,
    email: normalizeString(existing.email) ?? normalizeString(updates.email) ?? fallbackEmail ?? null,
    firstName,
    lastName,
    name: computedName,
    phone: normalizeString(updates.phone) ?? normalizeString(existing.phone),
    street: normalizeString(updates.street) ?? normalizeString(existing.street),
    zipCode: normalizeString(updates.zipCode) ?? normalizeString(existing.zipCode),
    city: normalizeString(updates.city) ?? normalizeString(existing.city),
    country: normalizeString(updates.country) ?? normalizeString(existing.country) ?? 'France',
    avatar: updates.avatar ?? existing.avatar ?? null,
    addresses: Array.isArray(updates.addresses)
      ? updates.addresses
      : Array.isArray(existing.addresses)
      ? existing.addresses
      : [],
    balance: Number(existing.balance) || 0,
    role: normalizeString(updates.role) ?? normalizeString(existing.role) ?? 'user',
    createdAt: existing.createdAt ?? new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

// Route handlers
const setupRoutes = (router: Hono) => {
  // Health check
  router.get("/health", (c) => {
    return c.json({ 
      status: "ok", 
      timestamp: new Date().toISOString(),
      service: "SuperMalin API"
    });
  });

  // Config
  router.get("/config", (c) => {
    return c.json({
      stripePublicKey: Deno.env.get("STRIPE_PUBLIC_KEY") || "pk_test_placeholder"
    });
  });

  // Products
  router.get("/products", async (c) => {
    try {
      const products = await kv.getByPrefix("product:");
      return c.json(products);
    } catch (e) {
      return c.json([]);
    }
  });

  // Search products
  router.get("/products/search", async (c) => {
    try {
      const query = c.req.query('q')?.toLowerCase() || '';
      if (!query) return c.json([]);
      
      const products = await kv.getByPrefix("product:");
      const filtered = products.filter((p: any) => {
        const searchText = `${p.name} ${p.description || ''} ${p.category || ''} ${p.tags?.join(' ') || ''}`.toLowerCase();
        return searchText.includes(query);
      });
      
      return c.json(filtered);
    } catch (e) {
      console.error("Search error:", e);
      return c.json([]);
    }
  });

  router.post("/products", async (c) => {
    try {
      const p = await c.req.json();
      p.id = p.id || crypto.randomUUID();
      await kv.set(`product:${p.id}`, p);
      return c.json(p);
    } catch (e) {
      return c.json({ error: e.message }, 400);
    }
  });

  router.put("/products/:id", async (c) => {
    const id = c.req.param('id');
    const updates = await c.req.json();
    const existing = await kv.get(`product:${id}`);
    if (!existing) return c.json({ error: "Not found" }, 404);
    const updated = { ...existing, ...updates, id };
    await kv.set(`product:${id}`, updated);
    return c.json(updated);
  });

  router.delete("/products/:id", async (c) => {
    const id = c.req.param('id');
    await kv.del(`product:${id}`);
    return c.json({ success: true });
  });

  // Profile
  router.get("/profile/:id", async (c) => {
  try {
    const id = c.req.param('id');
    const profile = await kv.get(`profile:${id}`);

    if (profile) {
      return c.json(profile);
    }

    return c.json({
      userId: id,
      email: null,
      firstName: null,
      lastName: null,
      name: null,
      phone: null,
      street: null,
      zipCode: null,
      city: null,
      country: 'France',
      avatar: null,
      addresses: [],
      balance: 0,
      role: 'user',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  } catch (e) {
    console.error("Error fetching profile:", e);
    return c.json({ error: e.message }, 500);
  }
});

  router.put("/profile/:id", async (c) => {
  try {
    const id = c.req.param('id');
    const updates = await c.req.json();
    const existing = (await kv.get(`profile:${id}`)) || {};

    const safeProfile = buildSafeProfile(id, existing, updates);

    await kv.set(`profile:${id}`, safeProfile);
    return c.json(safeProfile);
  } catch (e) {
    console.error("Error updating profile:", e);
    return c.json({ error: e.message }, 400);
  }
});

  // Upload avatar
  router.post("/profile/:userId/avatar", async (c) => {
    try {
      const userId = c.req.param('userId');
      const formData = await c.req.formData();
      const file = formData.get('file') as File;
      
      if (!file) {
        return c.json({ error: 'No file provided' }, 400);
      }

      // Ensure bucket exists
      const { data: buckets } = await supabase.storage.listBuckets();
      const bucketExists = buckets?.some(bucket => bucket.name === BUCKET_NAME);
      
      if (!bucketExists) {
        await supabase.storage.createBucket(BUCKET_NAME, {
          public: false,
          fileSizeLimit: 5242880 // 5MB
        });
      }

      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `avatars/${userId}-${Date.now()}.${fileExt}`;
      
      // Convert File to ArrayBuffer
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(fileName, uint8Array, {
          contentType: file.type,
          upsert: true
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        return c.json({ error: uploadError.message }, 500);
      }

      // Create signed URL (valid for 1 year)
      const { data: urlData } = await supabase.storage
        .from(BUCKET_NAME)
        .createSignedUrl(fileName, 31536000); // 1 year in seconds

      if (!urlData?.signedUrl) {
        return c.json({ error: 'Failed to create signed URL' }, 500);
      }

      // Update profile with avatar URL
      const existing = await kv.get(`profile:${userId}`) || {};
      const updated = { ...existing, avatar: urlData.signedUrl, userId };
      await kv.set(`profile:${userId}`, updated);

      return c.json({ avatar: urlData.signedUrl, success: true });
    } catch (error) {
      console.error('Avatar upload error:', error);
      return c.json({ error: error.message }, 500);
    }
  });

  // Users (Admin only ideally, but for now we list all profiles)
  router.get("/users", async (c) => {
    try {
      const users = await kv.getByPrefix("profile:");
      return c.json(users);
    } catch (e) {
      return c.json([]);
    }
  });

  // Promote user to admin
  router.post("/admin/promote", async (c) => {
    try {
      const { email } = await c.req.json();
      
      if (!email) {
        return c.json({ error: "Email required" }, 400);
      }

      console.log(`🔧 Promoting user with email: ${email} to admin`);
      
      // Get user by email from Supabase Auth
      const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
      
      if (listError) {
        console.error("Error listing users:", listError);
        return c.json({ error: "Failed to list users" }, 500);
      }

      const user = users?.find(u => u.email === email);
      
      if (!user) {
        return c.json({ error: "User not found" }, 404);
      }

      console.log(`✅ User found: ${user.id}`);

      // Update profile to admin role
      const existing = await kv.get(`profile:${user.id}`) || {};
      const updated = { 
        ...existing, 
        userId: user.id, 
        role: 'admin',
        email: user.email,
        updatedAt: new Date().toISOString()
      };
      
      await kv.set(`profile:${user.id}`, updated);
      
      console.log(`✅ User ${email} promoted to admin`);
      
      return c.json({ 
        success: true, 
        message: `User ${email} is now admin`,
        profile: updated
      });
      
    } catch (e) {
      console.error("Error promoting user:", e);
      return c.json({ error: e.message }, 500);
    }
  });

  // Transactions
  router.get("/transactions", async (c) => {
    const userId = c.req.query('userId');
    const transactions = await kv.getByPrefix("transaction:");
    if (userId) return c.json(transactions.filter((t: any) => t.userId === userId));
    return c.json(transactions);
  });

  router.post("/transactions", async (c) => {
    try {
      const data = await c.req.json();
      const id = `TR-${crypto.randomUUID().split('-')[0].toUpperCase()}`;
      const transaction = { ...data, id, date: new Date().toISOString(), status: 'Complété' };
      await kv.set(`transaction:${id}`, transaction);
      
      // Update balance if it's a credit/debit
      if (data.userId) {
        const profile = await kv.get(`profile:${data.userId}`) || { userId: data.userId, balance: 0 };
        if (data.type === 'credit') profile.balance += data.amount;
        else if (data.type === 'debit') profile.balance -= data.amount;
        await kv.set(`profile:${data.userId}`, profile);
      }
      
      return c.json(transaction);
    } catch (e) {
      return c.json({ error: e.message }, 400);
    }
  });

  // Orders
  router.get("/orders", async (c) => {
    const userId = c.req.query('userId');
    const orders = await kv.getByPrefix("order:");
    if (userId) return c.json(orders.filter((o: any) => o.userId === userId));
    return c.json(orders.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
  });

  router.post("/orders", async (c) => {
    try {
      const data = await c.req.json();
      const id = `ORD-${crypto.randomUUID().split('-')[0].toUpperCase()}`;
      const order = { ...data, id, createdAt: new Date().toISOString(), status: data.status || 'pending' };
      
      // Decrease stock for each item in the order
      if (data.items && Array.isArray(data.items)) {
        for (const item of data.items) {
          const product = await kv.get(`product:${item.id}`);
          if (product && product.stock) {
            product.stock = Math.max(0, (product.stock || 0) - 1);
            await kv.set(`product:${item.id}`, product);
            console.log(`Stock decreased for product ${item.id}: ${product.stock} remaining`);
          }
        }
      }
      
      // Debit wallet if used
      if (data.paymentMethod === 'wallet' && data.userId && data.total > 0) {
        const profile = await kv.get(`profile:${data.userId}`) || { userId: data.userId, balance: 0 };
        const amountToDebit = Math.min(profile.balance, data.total);
        if (amountToDebit > 0) {
          profile.balance -= amountToDebit;
          await kv.set(`profile:${data.userId}`, profile);
          
          // Create debit transaction
          const transactionId = `TR-${crypto.randomUUID().split('-')[0].toUpperCase()}`;
          await kv.set(`transaction:${transactionId}`, {
            id: transactionId,
            userId: data.userId,
            amount: amountToDebit,
            type: 'debit',
            label: `Paiement commande ${id}`,
            date: new Date().toISOString(),
            status: 'Complété'
          });
        }
      }
      
      await kv.set(`order:${id}`, order);
      
      // Send confirmation email
      if (data.shippingInfo?.email && RESEND_API_KEY) {
        try {
          const itemsList = data.items?.map((item: any) => 
            `<li style="margin-bottom: 8px;"><strong>${item.name}</strong> - ${item.price}€</li>`
          ).join('') || '';
          
          await resend.emails.send({
            from: 'SuperMalin <contact@supermalin.fr>',
            to: [data.shippingInfo.email],
            subject: `Confirmation de commande ${id} - SuperMalin`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: linear-gradient(135deg, #f97316 0%, #fb923c 100%); padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
                  <h1 style="color: white; margin: 0; font-size: 28px;">🎉 Commande Confirmée !</h1>
                </div>
                <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
                  <p style="font-size: 16px; color: #374151;">Bonjour <strong>${data.shippingInfo.name}</strong>,</p>
                  <p style="font-size: 16px; color: #374151;">Merci pour votre commande sur <strong style="color: #f97316;">SuperMalin</strong> ! 🚀</p>
                  
                  <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px;">N° de commande</p>
                    <p style="margin: 0; font-size: 24px; font-weight: bold; color: #f97316;">${id}</p>
                  </div>
                  
                  <h3 style="color: #111827; margin-top: 30px;">📦 Récapitulatif</h3>
                  <ul style="list-style: none; padding: 0; color: #374151;">
                    ${itemsList}
                  </ul>
                  
                  <div style="border-top: 2px solid #e5e7eb; margin: 20px 0; padding-top: 20px;">
                    <p style="font-size: 18px; color: #111827; margin: 0;"><strong>Total :</strong> <span style="color: #f97316; font-size: 24px; font-weight: bold;">${data.total.toFixed(2)}€</span></p>
                    <p style="font-size: 14px; color: #6b7280; margin: 5px 0 0 0;">Paiement ${data.paymentMethod === 'wallet' ? 'par portefeuille' : 'par carte bancaire'}</p>
                  </div>
                  
                  <p style="font-size: 14px; color: #6b7280; margin-top: 30px;">Vous recevrez un email de confirmation d'expédition dès que votre colis sera envoyé.</p>
                  
                  <div style="text-align: center; margin-top: 30px;">
                    <p style="color: #9ca3af; font-size: 12px;">L'équipe SuperMalin vous remercie de votre confiance 🧡</p>
                    <p style="color: #9ca3af; font-size: 11px; margin-top: 10px;">SuperMalin SAS - SIRET: 92822322100013</p>
                  </div>
                </div>
              </div>
            `
          });
          console.log(`Confirmation email sent to ${data.shippingInfo.email} for order ${id}`);
        } catch (emailError) {
          console.error(`Failed to send email for order ${id}:`, emailError);
          // Don't fail the order if email fails
        }
      }
      
      return c.json(order);
    } catch (e) {
      console.error("Order creation error:", e);
      return c.json({ error: e.message }, 400);
    }
  });

  // Update order
  router.put("/orders/:id", async (c) => {
    const id = c.req.param('id');
    const updates = await c.req.json();
    const existing = await kv.get(`order:${id}`);
    if (!existing) return c.json({ error: "Not found" }, 404);
    const updated = { ...existing, ...updates };
    await kv.set(`order:${id}`, updated);
    return c.json(updated);
  });

  // Requests (Buybacks/Consignment)
  router.get("/requests", async (c) => {
    const requests = await kv.getByPrefix("request:");
    return c.json(requests);
  });

  router.post("/requests", async (c) => {
    try {
      const data = await c.req.json();
      const id = `REQ-${crypto.randomUUID().split('-')[0].toUpperCase()}`;
      const request = { ...data, id, createdAt: new Date().toISOString(), status: 'pending' };
      await kv.set(`request:${id}`, request);
      return c.json(request);
    } catch (e) {
      return c.json({ error: e.message }, 400);
    }
  });

  router.put("/requests/:id", async (c) => {
    const id = c.req.param('id');
    const updates = await c.req.json();
    const existing = await kv.get(`request:${id}`);
    if (!existing) return c.json({ error: "Not found" }, 404);
    const updated = { ...existing, ...updates };
    await kv.set(`request:${id}`, updated);
    return c.json(updated);
  });

  // Stripe
  router.post("/checkout/create-payment-intent", async (c) => {
    try {
      const { cart, userId, amount } = await c.req.json();
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100),
        currency: "eur",
        metadata: { userId, cartCount: cart?.length || 0 },
      });
      return c.json({ clientSecret: paymentIntent.client_secret });
    } catch (e) {
      return c.json({ error: e.message }, 500);
    }
  });

  // Stripe Webhook - Secure validation of payments
  router.post("/stripe-webhook", async (c) => {
    const signature = c.req.header('stripe-signature');
    
    if (!signature || !STRIPE_WEBHOOK_SECRET) {
      console.error('Missing webhook signature or secret');
      return c.json({ error: 'Webhook signature missing' }, 400);
    }

    try {
      const body = await c.req.text();
      const event = stripe.webhooks.constructEvent(body, signature, STRIPE_WEBHOOK_SECRET);
      
      console.log(`Received Stripe webhook event: ${event.type}`);
      
      switch (event.type) {
        case 'payment_intent.succeeded':
          const paymentIntent = event.data.object;
          console.log(`Payment succeeded: ${paymentIntent.id}`, paymentIntent.metadata);
          
          // You can add additional order validation logic here
          // For example, mark order as paid, send notification, etc.
          
          break;
        
        case 'payment_intent.payment_failed':
          const failedPayment = event.data.object;
          console.error(`Payment failed: ${failedPayment.id}`);
          // Handle failed payment - notify user, log error, etc.
          break;
      }
      
      return c.json({ received: true });
    } catch (err) {
      console.error('Webhook error:', err.message);
      return c.json({ error: err.message }, 400);
    }
  });

  // Auth
router.post("/signup", async (c) => {
  try {
    const { email, password, firstName, lastName, name } = await c.req.json();

    const safeFirstName = normalizeString(firstName);
    const safeLastName = normalizeString(lastName);

    const signupFallbackName = [safeFirstName, safeLastName].filter(Boolean).join(' ').trim();

    const safeName =
      normalizeString(name) ??
      (signupFallbackName || null);
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: {
        name: safeName,
        firstName: safeFirstName,
        lastName: safeLastName,
      },
      email_confirm: true,
    });

    if (error) {
      return c.json({ error: error.message }, 400);
    }

    const profile = buildSafeProfile(
      data.user.id,
      {},
      {
        email,
        firstName: safeFirstName,
        lastName: safeLastName,
        name: safeName,
      },
      email
    );

    await kv.set(`profile:${data.user.id}`, profile);

    return c.json({ success: true, user: data.user });
  } catch (e) {
    console.error("Signup error:", e);
    return c.json({ error: e.message }, 500);
  }
});
  // Contact form
  router.post("/contact", async (c) => {
    try {
      const { name, email, subject, message } = await c.req.json();

      if (!name || !email || !message) {
        return c.json({ error: "Champs requis manquants" }, 400);
      }

      if (RESEND_API_KEY) {
        await resend.emails.send({
          from: 'SuperMalin <contact@supermalin.fr>',
          to: ['contact@supermalin.fr'],
          replyTo: email,
          subject: `[Contact] ${subject || 'Nouveau message'} - ${name}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: linear-gradient(135deg, #f97316, #fb923c); padding: 24px; border-radius: 12px 12px 0 0;">
                <h2 style="color: white; margin: 0;">💬 Nouveau message de contact</h2>
              </div>
              <div style="background: #fff; padding: 24px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
                <p><strong>Nom :</strong> ${name}</p>
                <p><strong>Email :</strong> <a href="mailto:${email}">${email}</a></p>
                <p><strong>Sujet :</strong> ${subject || 'Non précisé'}</p>
                <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 16px 0;" />
                <p><strong>Message :</strong></p>
                <p style="white-space: pre-wrap; color: #374151;">${message}</p>
              </div>
            </div>
          `,
        });

        // Confirmation to sender
        await resend.emails.send({
          from: 'SuperMalin <contact@supermalin.fr>',
          to: [email],
          subject: 'Nous avons bien reçu votre message - SuperMalin',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: linear-gradient(135deg, #f97316, #fb923c); padding: 24px; border-radius: 12px 12px 0 0;">
                <h2 style="color: white; margin: 0;">✅ Message bien reçu !</h2>
              </div>
              <div style="background: #fff; padding: 24px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
                <p>Bonjour <strong>${name}</strong>,</p>
                <p>Nous avons bien reçu votre message et nous vous répondrons dans les <strong>24 heures</strong>.</p>
                <p style="color: #6b7280; font-size: 14px;">L'équipe SuperMalin 🧡</p>
              </div>
            </div>
          `,
        });
      }

      return c.json({ success: true });
    } catch (e) {
      console.error("Contact form error:", e);
      return c.json({ error: e.message }, 500);
    }
  });

  // Sections Configuration
  router.get("/sections", async (c) => {
    try {
      const config = await kv.get("sections:config");
      if (!config) {
        // Default configuration
        return c.json({
          newLotsTitle: 'Nouveaux Lots',
          newLotsDescription: 'Découvrez nos derniers arrivages',
          newArrivalsTitle: 'Derniers Arrivages',
          newArrivalsDescription: 'Produits fraîchement ajoutés au catalogue',
          featuredProductIds: [],
          badges: {
            nouveau: true,
            arrivage: true,
            stockLimite: false
          },
          bannerMessage1: 'Derniers arrivages : +250 produits cette semaine',
          bannerMessage2: '120 MacBook Pro M3'
        });
      }
      return c.json(config);
    } catch (e) {
      console.error("Error fetching sections config:", e);
      return c.json({ error: e.message }, 500);
    }
  });

  router.post("/sections", async (c) => {
    try {
      const config = await c.req.json();
      await kv.set("sections:config", config);
      console.log("Sections config saved:", config);
      return c.json({ success: true, config });
    } catch (e) {
      console.error("Error saving sections config:", e);
      return c.json({ error: e.message }, 500);
    }
  });

};


const FUNCTION_NAME = "make-server-e62e42f7";
const prefixed = new Hono();
setupRoutes(prefixed);
app.route(`/${FUNCTION_NAME}`, prefixed);

Deno.serve(app.fetch);
