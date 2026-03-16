import { createBrowserRouter } from "react-router";
import { RootLayout } from "./layouts/RootLayout";
import { HomePage } from "./pages/HomePage";
import { ShopPage } from "./pages/ShopPage";
import { ProductDetailPage } from "./pages/ProductDetailPage";
import { CartPage } from "./pages/CartPage";
import { CheckoutPage } from "./pages/CheckoutPage";
import { ProfilePage } from "./pages/ProfilePage";
import { AdminPage } from "./pages/AdminPage";
import { NewArrivalsPage } from "./pages/NewArrivalsPage";
import { CGVPage } from "./pages/legal/CGVPage";
import { MentionsLegalesPage } from "./pages/legal/MentionsLegalesPage";
import { PolitiqueConfidentialitePage } from "./pages/legal/PolitiqueConfidentialitePage";
import { PolitiqueRetoursPage } from "./pages/legal/PolitiqueRetoursPage";
import { ContactPage } from "./pages/ContactPage";
import { ForgotPasswordPage } from "./pages/ForgotPasswordPage";
import { ResetPasswordPage } from "./pages/ResetPasswordPage";
import { TestResetPasswordPage } from "./pages/TestResetPasswordPage";
import { DevResetPasswordPage } from "./pages/DevResetPasswordPage";
import { PromoteAdminPage } from "./pages/PromoteAdminPage";
import { AdminLoginPage } from "./pages/AdminLoginPage";
import { DebugAdminPage } from "./pages/DebugAdminPage";
import { NotFoundPage } from "./pages/NotFoundPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: HomePage },
      { path: "boutique", Component: ShopPage },
      { path: "boutique/:id", Component: ProductDetailPage },
      { path: "nouveaux-arrivages", Component: NewArrivalsPage },
      { path: "panier", Component: CartPage },
      { path: "checkout", Component: CheckoutPage },
      { path: "profil", Component: ProfilePage },
      { path: "admin", Component: AdminPage },
      { path: "admin-login", Component: AdminLoginPage },
      { path: "promote-admin", Component: PromoteAdminPage },
      { path: "debug-admin", Component: DebugAdminPage },
      { path: "cgv", Component: CGVPage },
      { path: "mentions-legales", Component: MentionsLegalesPage },
      { path: "politique-confidentialite", Component: PolitiqueConfidentialitePage },
      { path: "politique-retours", Component: PolitiqueRetoursPage },
      { path: "contact", Component: ContactPage },
      { path: "*", Component: NotFoundPage },
    ],
  },
  // Routes sans layout (pages d'authentification)
  { path: "forgot-password", Component: ForgotPasswordPage },
  { path: "reset-password", Component: ResetPasswordPage },
  { path: "test-reset-password", Component: TestResetPasswordPage },
  { path: "dev-reset-password", Component: DevResetPasswordPage },
]);