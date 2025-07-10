import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/shadcn/card";
import { Button } from "@/components/shadcn/button";
import { Input } from "@/components/shadcn/input";
import { Textarea } from "@/components/shadcn/textarea";
import {
  Mail,
  Phone,
  MessageSquare,
  Clock,
  MapPin,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/shadcn/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/shadcn/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/shadcn/alert";
import { toast } from "sonner";

const SupportUsPage = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [emailError, setEmailError] = useState("");
  const [messageError, setMessageError] = useState("");

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Reset errors
    setEmailError("");
    setMessageError("");

    // Validate
    let isValid = true;

    if (!email.trim()) {
      setEmailError("Email is required");
      isValid = false;
    } else if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      isValid = false;
    }

    if (!message.trim()) {
      setMessageError("Message is required");
      isValid = false;
    }

    if (isValid) {
      // Show toast
      toast.success("Thank you for reaching out. We'll get back to you soon!");

      // Reset form
      setEmail("");
      setMessage("");
    }
  };

  const faqs = [
    {
      question: "How do I get a refund for my tickets?",
      answer:
        "Refunds can be requested up to 3 hours before showtime. Go to My Bookings, select the ticket, and click Request Refund. Processing takes 5-7 business days.",
    },
    {
      question: "Can I change my seat after booking?",
      answer:
        "Yes! You can modify your seat selection up to 1 hour before the show starts, subject to availability. Go to My Bookings and select Modify Seats.",
    },
    {
      question: "How do I redeem promotional codes?",
      answer:
        "Enter your promotional code in the designated field during checkout. The discount will be applied automatically if the code is valid.",
    },
    {
      question: "Is there a loyalty program?",
      answer:
        "Yes! Our MovieFan Rewards program lets you earn points with every booking. Collect enough points to get discounts or free tickets.",
    },
  ];

  return (
    <div className="container mx-auto p-6 max-w-6xl mt-20">
      <h1 className="text-4xl font-bold text-center mb-8 text-primary">
        Support & Contact
      </h1>

      <Tabs defaultValue="contact" className="mb-12">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="contact">Contact Us</TabsTrigger>
          <TabsTrigger value="faq">FAQs</TabsTrigger>
          <TabsTrigger value="hours">Hours & Location</TabsTrigger>
        </TabsList>

        <TabsContent value="contact" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Get in Touch
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium mb-1"
                    >
                      Email Address
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={emailError ? "border-red-500" : ""}
                    />
                    {emailError && (
                      <p className="text-red-500 text-sm mt-1">{emailError}</p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium mb-1"
                    >
                      Your Message
                    </label>
                    <Textarea
                      id="message"
                      placeholder="Share your suggestions, complaints, or questions..."
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className={messageError ? "border-red-500" : ""}
                    />
                    {messageError && (
                      <p className="text-red-500 text-sm mt-1">
                        {messageError}
                      </p>
                    )}
                  </div>

                  <Button type="submit" className="w-full">
                    Submit
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    Email Us
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="font-medium">Customer Support:</p>
                    <a
                      href="mailto:support@clicket.com"
                      className="text-primary hover:underline"
                    >
                      support@clicket.com
                    </a>
                  </div>
                  <div>
                    <p className="font-medium">Business Inquiries:</p>
                    <a
                      href="mailto:business@clicket.com"
                      className="text-primary hover:underline"
                    >
                      business@clicket.com
                    </a>
                  </div>
                  <div>
                    <p className="font-medium">Feedback:</p>
                    <a
                      href="mailto:feedback@clicket.com"
                      className="text-primary hover:underline"
                    >
                      feedback@clicket.com
                    </a>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Phone className="h-5 w-5" />
                    Call Us
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <p className="font-medium">Helpline:</p>
                    <a
                      href="tel:+01-4910647"
                      className="text-primary hover:underline"
                    >
                      +01-4910647
                    </a>
                    <p className="text-sm text-neutral-300">
                      Monday to Friday, 9 AM - 6 PM
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">Technical Support:</p>
                    <a
                      href="tel:+01-4910648"
                      className="text-primary hover:underline"
                    >
                      +01-4910648
                    </a>
                    <p className="text-sm text-neutral-300">24/7 Support</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="faq" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Frequently Asked Questions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger>{faq.question}</AccordionTrigger>
                    <AccordionContent>{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>

              <Alert className="mt-6">
                <CheckCircle className="h-4 w-4" />
                <AlertTitle>Can't find what you're looking for?</AlertTitle>
                <AlertDescription>
                  Contact our support team through the form or via email and
                  we'll get back to you as soon as possible.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hours" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Hours of Operation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between py-2 border-b">
                    <span className="font-medium">Monday - Friday</span>
                    <span>9:00 AM - 9:00 PM</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="font-medium">Saturday</span>
                    <span>10:00 AM - 10:00 PM</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="font-medium">Sunday</span>
                    <span>12:00 PM - 8:00 PM</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="font-medium">Holidays</span>
                    <span>Hours may vary</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Our Location
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <p className="font-medium">Clicket Headquarters</p>
                  <p>123 Movie Street</p>
                  <p>Entertainment District</p>
                  <p>Hollywood, CA 90028</p>
                </div>

                <div className="aspect-video bg-gray-200 rounded-md overflow-hidden flex items-center justify-center">
                  <img
                    src=""
                    alt="Office location map"
                    className="w-full h-full object-cover"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-12">
        <h2 className="text-2xl font-bold text-center mb-6">
          Our Support Team
        </h2>
        <div className="aspect-video max-w-2xl mx-auto bg-gray-200 rounded-md overflow-hidden flex items-center justify-center">
          <img
            src="/src/assets/misc/customer-support-team.jpg"
            alt="Our support team"
            className="w-full h-full object-cover"
          />
        </div>
        <p className="text-center mt-4 text-foreground max-w-2xl mx-auto">
          Our dedicated team of support specialists is available to assist you
          with any questions or concerns. We're committed to providing the best
          movie booking experience possible.
        </p>
      </div>
    </div>
  );
};

export default SupportUsPage;
