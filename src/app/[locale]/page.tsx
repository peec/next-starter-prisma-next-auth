import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CheckCircle, Star } from "lucide-react";
import { APP_NAME } from "@/settings";
import { Link } from "@/i18n/routing";

const features = [
  {
    title: "Personal & Team Tasks",
    content:
      "Manage both personal and team tasks in one place. Seamlessly switch between individual and collaborative work.",
  },
  {
    title: "Smart Organization",
    content:
      "Categorize tasks, set priorities, and use tags for easy filtering. Our AI suggests the best way to organize your tasks.",
  },
  {
    title: "Advanced Analytics",
    content:
      "Get insights into your productivity with detailed reports and visualizations. Track progress and identify areas for improvement.",
  },
];
const pricingPlans = [
  {
    title: "Basic",
    description: "For individuals",
    price: "$9.99/mo",
    features: ["Personal task management", "Basic analytics", "1 GB storage"],
    buttonLabel: "Start Free Trial",
  },
  {
    title: "Pro",
    description: "For small teams",
    price: "$24.99/mo",
    features: [
      "Team collaboration",
      "Advanced analytics",
      "10 GB storage",
      "Priority support",
    ],
    buttonLabel: "Start Free Trial",
  },
  {
    title: "Enterprise",
    description: "For large organizations",
    price: "Custom",
    features: [
      "Unlimited users",
      "Custom integrations",
      "Dedicated account manager",
      "24/7 premium support",
    ],
    buttonLabel: "Contact Sales",
  },
];
const testimonials = [
  {
    rating: 5,
    content:
      "{APP_NAME} has revolutionized how our team manages tasks. The collaboration features are top-notch!",
    author: "John Doe, Project Manager",
  },
  {
    rating: 5,
    content:
      "The analytics feature helps me understand my productivity patterns. I've never been more organized!",
    author: "Jane Smith, Freelancer",
  },
];
const faqItems = [
  {
    question: "How long is the free trial?",
    answer:
      "Our free trial lasts for 14 days, giving you ample time to explore all the features of {APP_NAME}.",
  },
  {
    question: "Can I change my plan later?",
    answer:
      "Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Absolutely. We use industry-standard encryption and security measures to protect your data. Your privacy and security are our top priorities.",
  },
];

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="w-full px-4 lg:px-6 h-14 flex items-center justify-center">
        <div className="container flex items-center justify-between">
          <Link className="flex items-center justify-center" href="#">
            <CheckCircle className="h-6 w-6 mr-2" />
            <span className="font-bold">{APP_NAME}</span>
          </Link>
          <nav className="flex gap-4 sm:gap-6">
            <Link
              className="text-sm font-medium hover:underline underline-offset-4"
              href="#features"
            >
              Features
            </Link>
            <Link
              className="text-sm font-medium hover:underline underline-offset-4"
              href="#pricing"
            >
              Pricing
            </Link>
            <Link
              className="text-sm font-medium hover:underline underline-offset-4"
              href="#faq"
            >
              FAQ
            </Link>
            <Link
              className="text-sm font-bold hover:underline underline-offset-4"
              href="/dashboard"
            >
              Go to dashboard
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Organize Your Life with {APP_NAME}
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
                  The ultimate todo app for individuals and teams. Stay
                  organized, boost productivity, and never miss a deadline.
                </p>
              </div>
              <div className="space-x-4">
                <Button asChild>
                  <Link href="/dashboard">Start Free Trial</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="#features">Learn More</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
        <section
          id="features"
          className="w-full py-12 md:py-24 lg:py-32 bg-gray-100"
        >
          <div className="container px-4 md:px-6 mx-auto">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8">
              Features That Make Us Stand Out
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feat) => (
                <Card key={feat.title}>
                  <CardHeader>
                    <CardTitle>{feat.title}</CardTitle>
                  </CardHeader>
                  <CardContent>{feat.content}</CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
        <section id="pricing" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6 mx-auto">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8">
              Choose Your Plan
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {pricingPlans.map((plan, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle>{plan.title}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-4xl font-bold">{plan.price}</p>
                    <ul className="mt-4 space-y-2">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-center">
                          <CheckCircle className="mr-2 h-4 w-4" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full">{plan.buttonLabel}</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100">
          <div className="container px-4 md:px-6 mx-auto">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8">
              What Our Users Say
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {testimonials.map((testimonial, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center">
                      {Array.from({ length: testimonial.rating }).map(
                        (_, i) => (
                          <Star key={i} className="text-yellow-400 mr-1" />
                        ),
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>{testimonial.content}</CardContent>
                  <CardFooter>
                    <p className="font-semibold">{testimonial.author}</p>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>
        <section id="faq" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6 mx-auto">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8">
              Frequently Asked Questions
            </h2>
            <Accordion
              type="single"
              collapsible
              className="w-full max-w-3xl mx-auto"
            >
              {faqItems.map((item, index) => (
                <AccordionItem key={index} value={`item-${index + 1}`}>
                  <AccordionTrigger>{item.question}</AccordionTrigger>
                  <AccordionContent>{item.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Ready to Get Started?
                </h2>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
                  Join thousands of satisfied users and take control of your
                  tasks today.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <Button asChild>
                  <Link href="/dashboard">Sign Up</Link>
                </Button>
                <p className="text-xs text-gray-500">
                  Start your 14-day free trial. No credit card required.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full py-6 px-4 md:px-6 border-t">
        <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
          </p>
          <nav className="flex gap-4 sm:gap-6 mt-4 sm:mt-0">
            <Link
              className="text-xs hover:underline underline-offset-4"
              href="#"
            >
              Terms of Service
            </Link>
            <Link
              className="text-xs hover:underline underline-offset-4"
              href="#"
            >
              Privacy
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
