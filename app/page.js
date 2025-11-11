'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Building2, Hammer, TrendingUp, Shield, Clock, Users } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Building2 className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">BuildConnect</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/signup">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Connect with Verified Contractors
            <span className="text-blue-600"> for Your Construction Projects</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Digital tender platform connecting builders with qualified contractors.
            Post projects, receive competitive bids, and hire with confidence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" className="text-lg px-8 py-6">
                <Building2 className="mr-2 h-5 w-5" />
                Post a Project
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                <Hammer className="mr-2 h-5 w-5" />
                Find Work
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="mx-auto bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <Building2 className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle>1. Post Your Project</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Builders post detailed project requirements with budget and timeline
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="mx-auto bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <Hammer className="h-8 w-8 text-orange-600" />
              </div>
              <CardTitle>2. Receive Bids</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Verified contractors submit competitive proposals with pricing and timelines
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="mx-auto bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle>3. Award & Build</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Compare bids, choose the best contractor, and start your project
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose BuildConnect?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <Shield className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Verified Contractors</h3>
              <p className="text-gray-600">
                All contractors are verified with ratings and project history
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <Clock className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Save Time</h3>
              <p className="text-gray-600">
                Digital platform eliminates paperwork and streamlines bidding
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <Users className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Wide Network</h3>
              <p className="text-gray-600">
                Access to contractors beyond your personal network
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-blue-600 mb-2">1000+</div>
            <div className="text-gray-600">Active Contractors</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-blue-600 mb-2">500+</div>
            <div className="text-gray-600">Projects Completed</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-blue-600 mb-2">4.8★</div>
            <div className="text-gray-600">Average Rating</div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of builders and contractors using BuildConnect
          </p>
          <Link href="/signup">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
              Create Free Account
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Building2 className="h-6 w-6" />
            <span className="text-xl font-bold">BuildConnect</span>
          </div>
          <p className="text-sm">
            © 2025 BuildConnect. Connecting construction professionals.
          </p>
        </div>
      </footer>
    </div>
  )
}
