"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, ShoppingBag, CreditCard, Check, ChevronRight, Star, Shield, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type View = "landing" | "product" | "checkout" | "success"

interface Product {
  id: number
  name: string
  price: number
  rating: number
  reviews: number
  description: string
  features: string[]
  image: string
}

const products: Product[] = [
  {
    id: 1,
    name: "AirPods Pro Max",
    price: 299,
    rating: 4.9,
    reviews: 2847,
    description: "Premium wireless earbuds with active noise cancellation and spatial audio.",
    features: ["Active Noise Cancellation", "Spatial Audio", "30hr Battery Life"],
    image: "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=400&h=400&fit=crop&q=80"
  },
  {
    id: 2,
    name: "UltraCharge Hub",
    price: 149,
    rating: 4.8,
    reviews: 1523,
    description: "Fast-charging station for all your devices with smart power delivery.",
    features: ["100W Power Delivery", "4 USB-C Ports", "Compact Design"],
    image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=400&fit=crop&q=80"
  },
  {
    id: 3,
    name: "SmartWatch Elite",
    price: 399,
    rating: 4.9,
    reviews: 3156,
    description: "Premium smartwatch with health monitoring and seamless connectivity.",
    features: ["Heart Rate Monitor", "GPS Tracking", "5-Day Battery"],
    image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400&h=400&fit=crop&q=80"
  }
]

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? "100%" : "-100%",
    opacity: 0
  }),
  center: {
    x: 0,
    opacity: 1
  },
  exit: (direction: number) => ({
    x: direction < 0 ? "100%" : "-100%",
    opacity: 0
  })
}

export function MobileShop() {
  const [view, setView] = useState<View>("landing")
  const [direction, setDirection] = useState(0)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [cartCount, setCartCount] = useState(0)

  const navigateTo = (newView: View, product?: Product) => {
    const viewOrder: View[] = ["landing", "product", "checkout", "success"]
    const currentIndex = viewOrder.indexOf(view)
    const newIndex = viewOrder.indexOf(newView)
    setDirection(newIndex > currentIndex ? 1 : -1)
    if (product) setSelectedProduct(product)
    setView(newView)
  }

  const handleBuyNow = () => {
    setCartCount(prev => prev + 1)
    navigateTo("checkout")
  }

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault()
    navigateTo("success")
  }

  return (
    <div className="h-dvh w-full overflow-hidden bg-background">
      {/* Mobile Shell */}
      <div className="relative mx-auto flex h-full max-w-md flex-col">
        {/* Header */}
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-border px-4">
          <AnimatePresence mode="wait">
            {view !== "landing" && view !== "success" ? (
              <motion.button
                key="back"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                onClick={() => navigateTo(view === "checkout" ? "product" : "landing")}
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </motion.button>
            ) : (
              <motion.div
                key="logo"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-lg font-semibold tracking-tight"
              >
                TechGear
              </motion.div>
            )}
          </AnimatePresence>
          
          {view !== "success" && (
            <button className="relative p-2">
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">
                  {cartCount}
                </span>
              )}
            </button>
          )}
        </header>

        {/* Main Content */}
        <main className="relative flex-1 overflow-hidden">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            {view === "landing" && (
              <motion.div
                key="landing"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: "tween", duration: 0.3 }}
                className="absolute inset-0 flex flex-col"
              >
                <LandingView onSelectProduct={(product) => navigateTo("product", product)} />
              </motion.div>
            )}

            {view === "product" && selectedProduct && (
              <motion.div
                key="product"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: "tween", duration: 0.3 }}
                className="absolute inset-0 flex flex-col"
              >
                <ProductView product={selectedProduct} onBuyNow={handleBuyNow} />
              </motion.div>
            )}

            {view === "checkout" && selectedProduct && (
              <motion.div
                key="checkout"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: "tween", duration: 0.3 }}
                className="absolute inset-0 flex flex-col"
              >
                <CheckoutView product={selectedProduct} onSubmit={handleCheckout} />
              </motion.div>
            )}

            {view === "success" && (
              <motion.div
                key="success"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: "tween", duration: 0.3 }}
                className="absolute inset-0 flex flex-col"
              >
                <SuccessView onContinue={() => { setCartCount(0); navigateTo("landing"); }} />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}

function LandingView({ onSelectProduct }: { onSelectProduct: (product: Product) => void }) {
  return (
    <div className="flex h-full flex-col px-4 py-4">
      {/* Hero Section */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight text-balance">
          Premium Tech
          <br />
          <span className="text-muted-foreground">For Modern Life</span>
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Discover our curated collection of tech essentials.
        </p>
      </div>

      {/* Featured Products */}
      <div className="flex-1 space-y-3 overflow-hidden">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-muted-foreground">Featured</h2>
          <span className="text-xs text-muted-foreground">{products.length} items</span>
        </div>
        
        <div className="grid gap-3">
          {products.map((product) => (
            <motion.button
              key={product.id}
              onClick={() => onSelectProduct(product)}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-3 rounded-xl border border-border bg-card p-3 text-left transition-colors hover:bg-secondary"
            >
              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-secondary">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium truncate">{product.name}</h3>
                <div className="flex items-center gap-1 mt-0.5">
                  <Star className="h-3 w-3 fill-accent text-accent" />
                  <span className="text-xs text-muted-foreground">
                    {product.rating} ({product.reviews.toLocaleString()})
                  </span>
                </div>
                <p className="mt-1 text-sm font-semibold">${product.price}</p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </motion.button>
          ))}
        </div>
      </div>

      {/* Trust Badges */}
      <div className="mt-4 flex items-center justify-center gap-6 border-t border-border pt-4">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Truck className="h-3.5 w-3.5" />
          Free Shipping
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Shield className="h-3.5 w-3.5" />
          2yr Warranty
        </div>
      </div>
    </div>
  )
}

function ProductView({ product, onBuyNow }: { product: Product; onBuyNow: () => void }) {
  return (
    <div className="flex h-full flex-col">
      {/* Product Image */}
      <div className="relative h-48 shrink-0 bg-secondary">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover"
        />
      </div>

      {/* Product Details */}
      <div className="flex flex-1 flex-col px-4 py-4">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold">{product.name}</h1>
            <div className="flex items-center gap-1 mt-1">
              <Star className="h-4 w-4 fill-accent text-accent" />
              <span className="text-sm">{product.rating}</span>
              <span className="text-sm text-muted-foreground">
                ({product.reviews.toLocaleString()} reviews)
              </span>
            </div>
          </div>
          <p className="text-xl font-bold">${product.price}</p>
        </div>

        <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
          {product.description}
        </p>

        {/* Features */}
        <div className="mt-4 space-y-2">
          <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Features</h3>
          <div className="grid gap-2">
            {product.features.map((feature, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-accent/10">
                  <Check className="h-3 w-3 text-accent" />
                </div>
                {feature}
              </div>
            ))}
          </div>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Buy Button */}
        <Button 
          onClick={onBuyNow}
          className="h-12 w-full text-base font-semibold"
          size="lg"
        >
          <ShoppingBag className="mr-2 h-5 w-5" />
          Buy Now — ${product.price}
        </Button>
      </div>
    </div>
  )
}

function CheckoutView({ product, onSubmit }: { product: Product; onSubmit: (e: React.FormEvent) => void }) {
  return (
    <div className="flex h-full flex-col px-4 py-4">
      <h1 className="text-xl font-bold">Checkout</h1>
      
      {/* Order Summary */}
      <div className="mt-4 flex items-center gap-3 rounded-xl border border-border bg-card p-3">
        <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-secondary">
          <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-sm">{product.name}</h3>
          <p className="text-sm text-muted-foreground">Qty: 1</p>
        </div>
        <p className="font-semibold">${product.price}</p>
      </div>

      {/* Payment Form */}
      <form onSubmit={onSubmit} className="mt-4 flex flex-1 flex-col space-y-3">
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-xs">Email</Label>
          <Input 
            id="email" 
            type="email" 
            placeholder="you@example.com" 
            required
            className="h-10"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="card" className="text-xs">Card Number</Label>
          <div className="relative">
            <Input 
              id="card" 
              placeholder="4242 4242 4242 4242" 
              required
              className="h-10 pr-10"
            />
            <CreditCard className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="expiry" className="text-xs">Expiry</Label>
            <Input 
              id="expiry" 
              placeholder="MM/YY" 
              required
              className="h-10"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="cvc" className="text-xs">CVC</Label>
            <Input 
              id="cvc" 
              placeholder="123" 
              required
              className="h-10"
            />
          </div>
        </div>

        <div className="flex-1" />

        {/* Total & Submit */}
        <div className="space-y-3 border-t border-border pt-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span>${product.price}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Shipping</span>
            <span className="text-accent">Free</span>
          </div>
          <div className="flex items-center justify-between font-semibold">
            <span>Total</span>
            <span>${product.price}</span>
          </div>
          
          <Button type="submit" className="h-12 w-full text-base font-semibold" size="lg">
            Pay ${product.price}
          </Button>
        </div>
      </form>
    </div>
  )
}

function SuccessView({ onContinue }: { onContinue: () => void }) {
  return (
    <div className="flex h-full flex-col items-center justify-center px-4 text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-accent/10"
      >
        <Check className="h-10 w-10 text-accent" />
      </motion.div>
      
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-2xl font-bold"
      >
        Order Confirmed!
      </motion.h1>
      
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-2 text-muted-foreground"
      >
        {"We'll send you a confirmation email shortly."}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-8 w-full max-w-xs"
      >
        <Button onClick={onContinue} variant="outline" className="h-12 w-full">
          Continue Shopping
        </Button>
      </motion.div>
    </div>
  )
}
