'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

export default function SampleForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    country: '',
    subscribe: false,
  })

  const [isSubmitted, setIsSubmitted] = useState(false)



  const handleSubmit = () => {
    console.log('Form submitted:', formData)
    setIsSubmitted(true)
    // Here you would typically send the data to a server
  }

  if (isSubmitted) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-bold mb-4">Thank You!</h2>
        <p>Your form has been submitted successfully.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Sample Form</h2>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            required
            className="w-full"
          />
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            required
            className="w-full"
          />
        </div>

        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            className="w-full"
          />
        </div>

        <div>
          <Label htmlFor="country">Country</Label>
          <Select name="country" value={formData.country} onValueChange={(value) => setFormData(prev => ({ ...prev, country: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select a country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="us">United States</SelectItem>
              <SelectItem value="ca">Canada</SelectItem>
              <SelectItem value="uk">United Kingdom</SelectItem>
              <SelectItem value="au">Australia</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="message">Message</Label>
          <Textarea
            id="message"
            name="message"
            value={formData.message}
            className="w-full"
            rows={4}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="subscribe"
            name="subscribe"
            checked={formData.subscribe}
          />
          <Label htmlFor="subscribe">Subscribe to newsletter</Label>
        </div>
      </div>

      <Button type="submit" className="w-full mt-6">
        Submit
      </Button>
    </form>
  )
}