import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Calendar,
  CheckCircle,
  Clock,
  Sparkles,
  BarChart3,
  Zap,
  Users,
  Star,
  MessageSquare,
  Mail,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  return (
    <div>
      <div className="bg-gradient-to-r from-purple-600 to-blue-500 text-white py-2 px-4 text-center text-sm">
        <span className="font-medium">✨ New Feature:</span> AI-powered roadmap
        suggestions now available!{" "}
        <Link
          href="/register"
          className="underline font-medium hover:text-blue-100"
        >
          Try it now
        </Link>
      </div>

      <div className="mx-auto max-w-7xl container px-4   ">
        <div className="flex flex-col min-h-screen">
          {/* Announcement Banner */}

          {/* Header */}
          <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between px-4 md:px-6">
              <Link href="/" className="flex items-center gap-2">
                <div className="bg-gradient-to-r from-purple-600 to-blue-500 rounded-lg p-1.5">
                  <Calendar className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">
                  Goal Forge
                </span>
              </Link>
              <nav className="hidden md:flex gap-6 items-center">
                <Link
                  href="#features"
                  className="text-sm font-medium hover:text-primary transition-colors"
                >
                  Features
                </Link>
                <Link
                  href="#how-it-works"
                  className="text-sm font-medium hover:text-primary transition-colors"
                >
                  How It Works
                </Link>
                <Link
                  href="#testimonials"
                  className="text-sm font-medium hover:text-primary transition-colors"
                >
                  Testimonials
                </Link>
                <Link
                  href="#pricing"
                  className="text-sm font-medium hover:text-primary transition-colors"
                >
                  Pricing
                </Link>
                <Link
                  href="#faq"
                  className="text-sm font-medium hover:text-primary transition-colors"
                >
                  FAQ
                </Link>
              </nav>
              <div className="flex gap-4">
                <Link href="/login">
                  <Button variant="ghost" className="hidden sm:flex">
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </header>

          <main className="flex-1">
            {/* Hero Section */}
            <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-gray-800">
              <div className="container px-4 md:px-6">
                <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
                  <div className="flex flex-col justify-center space-y-4">
                    <div className="space-y-2">
                      <Badge className="inline-flex mb-2 bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">
                        <Sparkles className="mr-1 h-3 w-3" /> AI-Powered
                        Roadmaps
                      </Badge>
                      <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">
                        Transform Your Ideas into Actionable Roadmaps
                      </h1>
                      <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                        Goal Forge helps you break down complex projects into
                        manageable phases and daily tasks. Just describe your
                        project, and our AI will generate a detailed roadmap for
                        you.
                      </p>
                    </div>
                    <div className="flex flex-col gap-2 min-[400px]:flex-row">
                      <Link href="/register">
                        <Button
                          size="lg"
                          className="gap-1 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white"
                        >
                          Get Started Free
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Link href="#how-it-works">
                        <Button
                          size="lg"
                          variant="outline"
                          className="border-purple-200 dark:border-purple-800"
                        >
                          See How It Works
                        </Button>
                      </Link>
                    </div>
                    <div className="flex items-center gap-4 mt-4">
                      <div className="flex -space-x-2">
                        {[1, 2, 3, 4].map((i) => (
                          <div
                            key={i}
                            className={`inline-block h-8 w-8 rounded-full border-2 border-background bg-gradient-to-r from-purple-${
                              i * 100
                            } to-blue-${i * 100}`}
                          />
                        ))}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-medium">1,000+</span> project
                        roadmaps created
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-center">
                    <div className="relative w-full max-w-[500px] p-4 bg-white dark:bg-gray-950 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 p-3 rounded-lg">
                          <CheckCircle className="h-5 w-5 text-green-500" />
                          <span className="font-medium">
                            Phase-based Planning
                          </span>
                        </div>
                        <div className="flex items-center gap-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 p-3 rounded-lg">
                          <CheckCircle className="h-5 w-5 text-green-500" />
                          <span className="font-medium">
                            Daily Task Breakdown
                          </span>
                        </div>
                        <div className="flex items-center gap-2 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 p-3 rounded-lg">
                          <CheckCircle className="h-5 w-5 text-green-500" />
                          <span className="font-medium">
                            AI-Powered Roadmaps
                          </span>
                        </div>
                        <div className="flex items-center gap-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 p-3 rounded-lg">
                          <CheckCircle className="h-5 w-5 text-green-500" />
                          <span className="font-medium">
                            Project Timeline Visualization
                          </span>
                        </div>
                        <div className="flex items-center gap-2 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 p-3 rounded-lg">
                          <Clock className="h-5 w-5 text-blue-500" />
                          <span className="font-medium">
                            Save Hours of Planning Time
                          </span>
                        </div>
                      </div>
                      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full blur-3xl" />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Brands Section */}
            <section className="w-full py-12 border-y bg-gray-50 dark:bg-gray-900">
              <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                  <div className="space-y-2">
                    <h2 className="text-xl font-medium text-gray-500 dark:text-gray-400">
                      Trusted by teams from
                    </h2>
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 lg:gap-16 opacity-70">
                    {[
                      "Acme Inc",
                      "Globex",
                      "Stark Industries",
                      "Wayne Enterprises",
                      "Umbrella Corp",
                    ].map((brand) => (
                      <div
                        key={brand}
                        className="text-xl font-semibold text-gray-500 dark:text-gray-400"
                      >
                        {brand}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Features Section */}
            <section id="features" className="w-full py-12 md:py-24 lg:py-32">
              <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                  <div className="space-y-2">
                    <Badge className="mb-2">Features</Badge>
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                      Everything You Need to Plan Your Projects
                    </h2>
                    <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                      Goal Forge provides powerful tools to help you plan,
                      track, and execute your projects efficiently
                    </p>
                  </div>
                </div>
                <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
                  {[
                    {
                      icon: <Sparkles className="h-10 w-10 text-purple-500" />,
                      title: "AI-Powered Planning",
                      description:
                        "Our AI analyzes your project requirements and generates comprehensive roadmaps tailored to your needs",
                    },
                    {
                      icon: <BarChart3 className="h-10 w-10 text-blue-500" />,
                      title: "Visual Progress Tracking",
                      description:
                        "Track your progress with intuitive visualizations and stay on top of your project timeline",
                    },
                    {
                      icon: <Zap className="h-10 w-10 text-yellow-500" />,
                      title: "Instant Roadmaps",
                      description:
                        "Generate detailed project roadmaps in seconds, not hours, saving you valuable planning time",
                    },
                    {
                      icon: <Calendar className="h-10 w-10 text-green-500" />,
                      title: "Daily Task Breakdown",
                      description:
                        "Get your project broken down into manageable daily tasks with clear objectives",
                    },
                    {
                      icon: <Users className="h-10 w-10 text-red-500" />,
                      title: "Team Collaboration",
                      description:
                        "Share your roadmaps with team members and collaborate on project planning and execution",
                    },
                    {
                      icon: <Clock className="h-10 w-10 text-indigo-500" />,
                      title: "Time Estimation",
                      description:
                        "Get realistic time estimates for your project phases based on complexity and requirements",
                    },
                  ].map((feature, index) => (
                    <div
                      key={index}
                      className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm transition-all hover:shadow-md"
                    >
                      <div className="rounded-full bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 p-3">
                        {feature.icon}
                      </div>
                      <h3 className="text-xl font-bold">{feature.title}</h3>
                      <p className="text-gray-500 dark:text-gray-400 text-center">
                        {feature.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* How It Works Section */}
            <section
              id="how-it-works"
              className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800"
            >
              <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                  <div className="space-y-2">
                    <Badge className="mb-2 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                      Simple Process
                    </Badge>
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                      How Goal Forge Works
                    </h2>
                    <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                      Goal Forge simplifies project planning with our intuitive
                      roadmap generator
                    </p>
                  </div>
                </div>
                <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
                  {[
                    {
                      step: 1,
                      title: "Describe Your Project",
                      description:
                        "Enter a detailed description of your project goals and requirements",
                      color: "from-purple-500 to-blue-500",
                    },
                    {
                      step: 2,
                      title: "Generate Your Roadmap",
                      description:
                        "Our AI analyzes your project and creates a comprehensive roadmap",
                      color: "from-blue-500 to-purple-500",
                    },
                    {
                      step: 3,
                      title: "Track Your Progress",
                      description:
                        "View your roadmap by phases or daily tasks and track your progress",
                      color: "from-purple-500 to-blue-500",
                    },
                  ].map((step) => (
                    <div
                      key={step.step}
                      className="flex flex-col justify-center space-y-4 relative"
                    >
                      <div
                        className={`flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r ${step.color} text-white`}
                      >
                        <span className="text-xl font-bold">{step.step}</span>
                      </div>
                      <h3 className="text-xl font-bold">{step.title}</h3>
                      <p className="text-gray-500 dark:text-gray-400">
                        {step.description}
                      </p>
                      {step.step < 3 && (
                        <div className="hidden lg:block absolute top-8 left-full w-16 h-0.5 bg-gradient-to-r from-purple-300 to-blue-300 dark:from-purple-800 dark:to-blue-800 -translate-x-8" />
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-12 flex justify-center">
                  <Link href="/register">
                    <Button
                      size="lg"
                      className="gap-2 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white"
                    >
                      Start Creating Your Roadmap
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </section>

            {/* Demo Section */}
            <section className="w-full py-12 md:py-24 lg:py-32">
              <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                  <div className="space-y-2">
                    <Badge className="mb-2 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                      See It In Action
                    </Badge>
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                      Watch Goal Forge in Action
                    </h2>
                    <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                      See how easy it is to create detailed project roadmaps
                      with Goal Forge
                    </p>
                  </div>
                </div>
                <div className="mx-auto max-w-4xl mt-12">
                  <div className="aspect-video overflow-hidden rounded-2xl border shadow-xl bg-white dark:bg-gray-950">
                    <div className="w-full h-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                      <div className="text-center space-y-4">
                        <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-white"
                          >
                            <polygon points="5 3 19 12 5 21 5 3"></polygon>
                          </svg>
                        </div>
                        <p className="text-gray-500 dark:text-gray-400">
                          Click to watch demo
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Testimonials Section */}
            <section
              id="testimonials"
              className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800"
            >
              <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                  <div className="space-y-2">
                    <Badge className="mb-2 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                      Testimonials
                    </Badge>
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                      What Our Users Say
                    </h2>
                    <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                      Hear from people who have transformed their project
                      planning with Goal Forge
                    </p>
                  </div>
                </div>
                <div className="mx-auto grid max-w-5xl gap-6 py-12 lg:grid-cols-3">
                  {[
                    {
                      quote:
                        "Goal Forge has completely transformed how I plan my projects. What used to take days now takes minutes!",
                      author: "Sarah Johnson",
                      role: "Product Manager",
                      avatar: "SJ",
                    },
                    {
                      quote:
                        "The AI-generated roadmaps are incredibly accurate and save me hours of planning time. Highly recommended!",
                      author: "Michael Chen",
                      role: "Software Developer",
                      avatar: "MC",
                    },
                    {
                      quote:
                        "As a freelancer, I need to plan multiple projects efficiently. Goal Forge has become an essential tool in my workflow.",
                      author: "Emma Rodriguez",
                      role: "Freelance Designer",
                      avatar: "ER",
                    },
                  ].map((testimonial, index) => (
                    <div
                      key={index}
                      className="flex flex-col justify-between rounded-lg border bg-white p-6 shadow-sm dark:bg-gray-950 h-full"
                    >
                      <div>
                        <div className="flex gap-1 mb-4">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className="h-5 w-5 fill-yellow-400 text-yellow-400"
                            />
                          ))}
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 mb-4">
                          "{testimonial.quote}"
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                          {testimonial.avatar}
                        </div>
                        <div>
                          <p className="font-medium">{testimonial.author}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {testimonial.role}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="w-full py-12 md:py-24 lg:py-32">
              <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                  <div className="space-y-2">
                    <Badge className="mb-2">Pricing</Badge>
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                      Simple, Transparent Pricing
                    </h2>
                    <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                      Choose the plan that's right for you
                    </p>
                  </div>
                </div>
                <div className="mx-auto grid max-w-5xl gap-6 py-12 lg:grid-cols-3">
                  {[
                    {
                      name: "Free",
                      price: "$0",
                      description:
                        "Perfect for individuals just getting started",
                      features: [
                        "3 roadmaps per month",
                        "Basic AI roadmap generation",
                        "7-day roadmap history",
                        "Email support",
                      ],
                      cta: "Get Started",
                      popular: false,
                      color: "border-gray-200 dark:border-gray-800",
                    },
                    {
                      name: "Pro",
                      price: "$12",
                      period: "/month",
                      description: "Ideal for professionals and small teams",
                      features: [
                        "Unlimited roadmaps",
                        "Advanced AI roadmap generation",
                        "Unlimited roadmap history",
                        "Priority email support",
                        "Team sharing",
                        "Custom templates",
                      ],
                      cta: "Get Started",
                      popular: true,
                      color: "border-purple-500",
                    },
                    {
                      name: "Enterprise",
                      price: "Custom",
                      description: "For organizations with advanced needs",
                      features: [
                        "Everything in Pro",
                        "Custom AI training",
                        "API access",
                        "SSO authentication",
                        "Dedicated account manager",
                        "Custom integrations",
                      ],
                      cta: "Contact Sales",
                      popular: false,
                      color: "border-gray-200 dark:border-gray-800",
                    },
                  ].map((plan) => (
                    <div
                      key={plan.name}
                      className={`flex flex-col rounded-lg border ${
                        plan.color
                      } bg-white p-6 shadow-sm dark:bg-gray-950 relative ${
                        plan.popular ? "ring-2 ring-purple-500" : ""
                      }`}
                    >
                      {plan.popular && (
                        <div className="absolute -top-4 left-0 right-0 mx-auto w-fit px-4 py-1 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 text-white text-xs font-medium">
                          Most Popular
                        </div>
                      )}
                      <div className="mb-4">
                        <h3 className="text-lg font-bold">{plan.name}</h3>
                        <div className="mt-2 flex items-baseline">
                          <span className="text-3xl font-bold">
                            {plan.price}
                          </span>
                          {plan.period && (
                            <span className="text-gray-500 dark:text-gray-400">
                              {plan.period}
                            </span>
                          )}
                        </div>
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                          {plan.description}
                        </p>
                      </div>
                      <ul className="mb-6 space-y-2 flex-1">
                        {plan.features.map((feature) => (
                          <li
                            key={feature}
                            className="flex items-center gap-2 text-sm"
                          >
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <Button
                        className={`w-full ${
                          plan.popular
                            ? "bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white"
                            : ""
                        }`}
                        variant={plan.popular ? "default" : "outline"}
                      >
                        {plan.cta}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* FAQ Section */}
            <section
              id="faq"
              className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-900"
            >
              <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                  <div className="space-y-2">
                    <Badge className="mb-2 bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">
                      FAQ
                    </Badge>
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                      Frequently Asked Questions
                    </h2>
                    <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                      Find answers to common questions about Goal Forge
                    </p>
                  </div>
                </div>
                <div className="mx-auto max-w-3xl mt-12">
                  <Accordion type="single" collapsible className="w-full">
                    {[
                      {
                        question: "How does Goal Forge generate roadmaps?",
                        answer:
                          "Goal Forge uses advanced AI algorithms to analyze your project description and requirements. It then breaks down your project into logical phases and daily tasks, creating a comprehensive roadmap tailored to your specific needs.",
                      },
                      {
                        question: "Can I customize the generated roadmaps?",
                        answer:
                          "Yes, absolutely! While our AI creates a solid foundation for your roadmap, you can fully customize every aspect of it. You can adjust phases, modify tasks, change durations, and more to perfectly fit your project requirements.",
                      },
                      {
                        question: "Is my project data secure?",
                        answer:
                          "We take data security very seriously. All your project data is encrypted and stored securely. We never share your information with third parties, and our AI processing is done with privacy in mind.",
                      },
                      {
                        question: "Can I share my roadmaps with my team?",
                        answer:
                          "Yes, our Pro and Enterprise plans include team sharing features. You can invite team members to view and collaborate on your roadmaps, making it easy to keep everyone aligned on project goals and timelines.",
                      },
                      {
                        question: "Do you offer refunds?",
                        answer:
                          "Yes, we offer a 14-day money-back guarantee for our paid plans. If you're not satisfied with Goal Forge for any reason, simply contact our support team within 14 days of your purchase for a full refund.",
                      },
                      {
                        question: "How accurate are the AI-generated roadmaps?",
                        answer:
                          "Our AI has been trained on thousands of successful projects across various industries. While no AI is perfect, our users report that the generated roadmaps are highly accurate and require minimal adjustments. The more detailed your project description, the more accurate the roadmap will be.",
                      },
                    ].map((item, index) => (
                      <AccordionItem key={index} value={`item-${index}`}>
                        <AccordionTrigger className="text-left font-medium">
                          {item.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-500 dark:text-gray-400">
                          {item.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
                <div className="mt-12 text-center">
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    Still have questions?
                  </p>
                  <Link href="#contact">
                    <Button variant="outline" className="gap-2">
                      Contact Support
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </section>

            {/* CTA Section */}
            <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-purple-600 to-blue-500 text-white">
              <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                  <div className="space-y-2">
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                      Ready to Transform Your Project Planning?
                    </h2>
                    <p className="max-w-[900px] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed opacity-90">
                      Join thousands of users who have revolutionized their
                      project management with Goal Forge
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 min-[400px]:flex-row">
                    <Link href="/register">
                      <Button
                        size="lg"
                        className="gap-1 bg-white text-purple-600 hover:bg-gray-100"
                      >
                        Get Started Free
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href="#demo">
                      <Button
                        size="lg"
                        variant="outline"
                        className="border-white text-white hover:bg-white/10"
                      >
                        Watch Demo
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </section>

            {/* Newsletter Section */}
            <section id="contact" className="w-full py-12 md:py-24 lg:py-32">
              <div className="container px-4 md:px-6">
                <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
                  <div className="flex flex-col justify-center space-y-4">
                    <div className="space-y-2">
                      <Badge className="mb-2">Stay Updated</Badge>
                      <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                        Subscribe to Our Newsletter
                      </h2>
                      <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed dark:text-gray-400">
                        Get the latest updates, tips, and exclusive offers
                        delivered straight to your inbox
                      </p>
                    </div>
                    <div className="flex flex-col gap-2 min-[400px]:flex-row">
                      <div className="flex max-w-sm items-center gap-2 rounded-lg border bg-background px-3 py-2 text-sm ring-offset-background">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <input
                          type="email"
                          placeholder="Enter your email"
                          className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
                        />
                      </div>
                      <Button className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white">
                        Subscribe
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      By subscribing, you agree to our Terms of Service and
                      Privacy Policy.
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 rounded-lg border bg-gradient-to-r from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-6">
                    <div className="flex items-center gap-2">
                      <div className="rounded-full bg-gradient-to-r from-purple-500 to-blue-500 p-2">
                        <MessageSquare className="h-4 w-4 text-white" />
                      </div>
                      <h3 className="text-lg font-medium">Contact Us</h3>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Have questions or need help? Our support team is here for
                      you.
                    </p>
                    <div className="mt-4 grid gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" placeholder="Your name" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="Your email"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="message">Message</Label>
                        <textarea
                          id="message"
                          className="min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          placeholder="How can we help you?"
                        />
                      </div>
                      <Button className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white">
                        Send Message
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </main>

          <footer className="border-t py-6 md:py-0">
            <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
              <div className="flex items-center gap-2">
                <div className="bg-gradient-to-r from-purple-600 to-blue-500 rounded-lg p-1.5">
                  <Calendar className="h-4 w-4 text-white" />
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  &copy; {new Date().getFullYear()} Goal Forge. All rights
                  reserved.
                </p>
              </div>
              <div className="flex gap-4 text-sm text-gray-500 dark:text-gray-400">
                <Link href="#" className="hover:underline">
                  Terms
                </Link>
                <Link href="#" className="hover:underline">
                  Privacy
                </Link>
                <Link href="#" className="hover:underline">
                  Cookies
                </Link>
                <Link href="#" className="hover:underline">
                  Contact
                </Link>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
