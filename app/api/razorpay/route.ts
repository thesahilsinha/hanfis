import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { amount } = await req.json()

    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return NextResponse.json({ error: 'Razorpay keys not configured' }, { status: 500 })
    }

    const response = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + Buffer.from(`${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`).toString('base64'),
      },
      body: JSON.stringify({
        amount: Math.round(amount * 100), // paise
        currency: 'INR',
        receipt: 'receipt_' + Date.now(),
      }),
    })

    const order = await response.json()

    if (!response.ok) {
      console.error('Razorpay error:', order)
      return NextResponse.json({ error: order.error?.description || 'Razorpay failed' }, { status: 500 })
    }

    return NextResponse.json(order)
  } catch (err) {
    console.error('Razorpay route error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}