import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
// import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
// import LocaleSwitcher from "../../components/locale-switcher";

export default async function HomePage() {
  // const t = useTranslations("HomePage");
  const t = await getTranslations("HomePage");

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-24">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl mb-6">
              Transform Your Gym Business with Smart Management
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              All-in-one platform for gym owners to manage members, track
              progress, and boost revenue through integrated services and
              products.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link href="/auth/signup">Start Free Trial</Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                asChild
                className="w-full sm:w-auto"
              >
                <Link href="#features">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <p>This text is rendered on the server: {t("title")}</p>
      {/* <LocaleSwitcher /> */}

      {/* Features Section */}
      <section id="features" className="py-24 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">
            Comprehensive Gym Management Solution
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>For Gym Owners</CardTitle>
                <CardDescription>Streamline your operations</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                  <li>• Member management and billing</li>
                  <li>• Class and trainer scheduling</li>
                  <li>• Inventory and product sales</li>
                  <li>• Revenue analytics and reporting</li>
                  <li>• Marketing and promotions</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>For Personal Trainers</CardTitle>
                <CardDescription>Enhance client relationships</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                  <li>• Client progress tracking</li>
                  <li>• Custom workout planning</li>
                  <li>• Nutrition program management</li>
                  <li>• Client communication tools</li>
                  <li>• Performance analytics</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>For Members</CardTitle>
                <CardDescription>Personalized fitness journey</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                  <li>• Workout tracking and history</li>
                  <li>• Progress visualization</li>
                  <li>• Nutrition and supplement shop</li>
                  <li>• PT booking and messaging</li>
                  <li>• Class scheduling</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Revenue Section */}
      <section className="py-24 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8">
              Boost Your Revenue Streams
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Additional Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-gray-600 dark:text-gray-300 text-left">
                    <li>• Nutrition and supplement sales</li>
                    <li>• PT session bookings</li>
                    <li>• Class packages</li>
                    <li>• Premium memberships</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Business Growth</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-gray-600 dark:text-gray-300 text-left">
                    <li>• Member retention tools</li>
                    <li>• Automated marketing</li>
                    <li>• Performance analytics</li>
                    <li>• Business insights</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">
              Ready to Transform Your Gym?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Join hundreds of successful gyms already using our platform
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link href="/auth/signup">Start Free Trial</Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                asChild
                className="w-full sm:w-auto"
              >
                <Link href="/contact">Schedule Demo</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
