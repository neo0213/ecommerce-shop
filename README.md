# E-Commerce Shop

A modern e-commerce website built with Next.js and Tailwind CSS.

## Features

- 🛍️ Product browsing and shopping cart
- 🔐 User authentication
- 🌙 Dark mode support
- 👑 Admin dashboard with user analytics
- 💎 Loyalty program with 20% discount
- 📱 Responsive design

## Tech Stack

- Next.js
- React
- Tailwind CSS
- Local Storage for data persistence

## Getting Started

1. Clone the repository:
```bash
git clone <your-repo-url>
cd <your-repo-name>
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `/components` - Reusable UI components
- `/context` - React context providers
- `/pages` - Next.js pages and API routes
- `/styles` - Global styles and Tailwind configuration

## Features in Detail

### User Authentication
- Register and login functionality
- Persistent sessions using localStorage
- User profile management

### Shopping Experience
- Browse products from Fake Store API
- Add items to cart
- View cart and checkout
- Apply loyalty discounts

### Admin Dashboard
- View user analytics
- Track user session times
- Monitor loyalty program status
- Export data as JSON

### Loyalty Program
- 20% discount on all purchases after first purchase
- Automatic activation after first checkout
- Status tracking in admin dashboard

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License. 