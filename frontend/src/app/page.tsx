"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { 
  Users, 
  BarChart3, 
  ShoppingCart,
  TrendingUp,
  ArrowDown,
  ArrowRight
} from "lucide-react";

export default function Home() {
  const router = useRouter();

  const products = [
    {
      id: "crm",
      title: "CRM",
      description: "Manage customer relationships, track leads, and close deals with our powerful CRM system.",
      icon: <Users className="h-8 w-8" />,
      gradient: "from-blue-500 to-blue-700",
      bgColor: "bg-gradient-to-br from-blue-500 to-blue-700",
      path: "/crm",
    },
    {
      id: "marketing",
      title: "Marketing",
      description: "Plan and execute marketing campaigns with our intuitive marketing automation tools.",
      icon: <TrendingUp className="h-8 w-8" />,
      gradient: "from-purple-500 to-purple-700",
      bgColor: "bg-gradient-to-br from-purple-500 to-purple-700",
      path: "#",
    },
    {
      id: "sales",
      title: "Sales",
      description: "Streamline your sales process and boost revenue with our sales management tools.",
      icon: <ShoppingCart className="h-8 w-8" />,
      gradient: "from-green-500 to-green-700",
      bgColor: "bg-gradient-to-br from-green-500 to-green-700",
      path: "#",
    },
    {
      id: "analytics",
      title: "Analytics",
      description: "Gain insights into your business performance with advanced analytics and reporting.",
      icon: <BarChart3 className="h-8 w-8" />,
      gradient: "from-orange-500 to-orange-700",
      bgColor: "bg-gradient-to-br from-orange-500 to-orange-700",
      path: "#",
    },
  ];

  const handleProductClick = (path: string, productId: string) => {
    if (productId === "crm") {
      router.push(path);
    }
  };

  const scrollToProducts = () => {
    const productsSection = document.getElementById("products");
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden bg-gradient-to-br from-primary/10 via-secondary/5 to-primary/10">
        <div className="container px-4 md:px-6 relative z-10">
          <div className="flex flex-col items-center text-center space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
                Welcome to <span className="text-primary"></span>Dwansys</h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
                Your all-in-one platform for managing customer relationships, marketing campaigns, 
                sales processes, and business analytics. Everything you need to grow your business in one place.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 pt-4"
            >
              <Button 
                size="lg" 
                className="group bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-lg px-8 py-6"
                onClick={scrollToProducts}
              >
                Explore Products
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-primary text-primary hover:bg-primary/10 text-lg px-8 py-6"
                onClick={scrollToProducts}
              >
                Learn More
                <ArrowDown className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
          </div>
        </div>
        
        {/* Background decoration */}
        <div className="absolute inset-0 -z-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-primary/5 rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-secondary/5 rounded-full blur-3xl animate-pulse-slow delay-1000"></div>
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full filter blur-3xl animate-float"></div>
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-secondary/10 rounded-full filter blur-3xl animate-float delay-2000"></div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-20 bg-background">
        <div className="container px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center space-y-4 mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold">Our Products</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover our suite of tools designed to help you manage every aspect of your business.
            </p>
          </motion.div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="h-full"
              >
                <Card 
                  className={`relative overflow-hidden transition-all duration-300 hover:shadow-xl cursor-pointer h-full flex flex-col ${
                    product.id === "crm" ? "border-primary/50" : ""
                  }`}
                  onClick={() => handleProductClick(product.path, product.id)}
                >
                  <div className={`h-2 ${product.bgColor}`}></div>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className={`p-3 rounded-lg bg-primary/10 text-primary`}>
                        {product.icon}
                      </div>
                      {product.id === "crm" && (
                        <span className="px-2 py-1 text-xs bg-primary/10 text-primary rounded-full">
                          Popular
                        </span>
                      )}
                    </div>
                    <CardTitle className="text-xl">{product.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-muted-foreground mb-6">{product.description}</p>
                    <Button 
                      className={`w-full bg-gradient-to-r ${product.gradient} hover:opacity-90`}
                      onClick={() => handleProductClick(product.path, product.id)}
                    >
                      {product.id === "crm" ? "Open CRM" : "Learn More"}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/50">
        <div className="container px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="grid gap-12 lg:grid-cols-2 items-center"
          >
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold">Why Choose Dwansys?</h2>
                <p className="text-muted-foreground mt-4">
                  We provide everything you need to build stronger customer relationships and grow your business.
                </p>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="mt-1 p-2 bg-primary/10 rounded-lg text-primary">
                    <Users className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">Customer-Centric Approach</h3>
                    <p className="text-muted-foreground mt-1">
                      Built with the customer at the center of everything we do.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="mt-1 p-2 bg-primary/10 rounded-lg text-primary">
                    <BarChart3 className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">Data-Driven Insights</h3>
                    <p className="text-muted-foreground mt-1">
                      Powerful analytics to help you make informed business decisions.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="mt-1 p-2 bg-primary/10 rounded-lg text-primary">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">Enterprise Security</h3>
                    <p className="text-muted-foreground mt-1">
                      Bank-level security with end-to-end encryption to keep your data safe.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <motion.div 
                className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl flex items-center justify-center"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-center p-8">
                  <h3 className="text-2xl font-bold mb-4">Transform Your Business</h3>
                  <p className="text-muted-foreground">
                    Experience the difference with our all-in-one solution.
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}