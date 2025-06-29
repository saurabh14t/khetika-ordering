# Ordering System ERP

A comprehensive Enterprise Resource Planning (ERP) system for order lifecycle management built with Next.js, TypeScript, and modern web technologies.

## Features

### 🏠 Dashboard
- Real-time metrics and KPIs
- Sales and order analytics
- Recent activity feed
- Interactive charts and visualizations

### 📦 Order Management
- Complete order lifecycle tracking
- Order status management (Pending → Processing → Shipped → Delivered)
- Customer order history
- Order details and item management

### 📊 Inventory Management
- Stock level tracking
- Low stock alerts
- Product categorization
- Inventory value calculations
- SKU management

### 👥 Customer Management
- Customer profiles and contact information
- Order history per customer
- Customer status tracking (Active, Inactive, VIP)
- Customer analytics and insights

### 📈 Reports & Analytics
- Sales trend analysis
- Revenue reporting
- Customer acquisition metrics
- Product performance analytics
- Export functionality

## Technology Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Charts**: Recharts
- **Icons**: Heroicons
- **Forms**: React Hook Form with Zod validation
- **Date Handling**: date-fns

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ordering-system-erp
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Project Structure

```
ordering-system-erp/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main page
├── components/            # React components
│   ├── Dashboard.tsx      # Dashboard component
│   ├── Orders.tsx         # Order management
│   ├── Inventory.tsx      # Inventory management
│   ├── Customers.tsx      # Customer management
│   ├── Reports.tsx        # Reports and analytics
│   ├── Sidebar.tsx        # Navigation sidebar
│   └── Header.tsx         # Top header
├── lib/                   # Utility libraries
│   └── store.ts          # Zustand store
├── public/               # Static assets
└── package.json          # Dependencies and scripts
```

## Key Features

### Order Lifecycle Management
- **Order Creation**: Create new orders with customer and item details
- **Status Tracking**: Monitor order progress through various stages
- **Inventory Integration**: Automatic stock updates when orders are processed
- **Customer Communication**: Track customer interactions and order history

### Inventory Control
- **Real-time Stock Levels**: Monitor current inventory quantities
- **Reorder Points**: Set minimum stock levels with automatic alerts
- **Category Management**: Organize products by categories
- **Value Tracking**: Calculate total inventory value

### Customer Relationship Management
- **Customer Profiles**: Store comprehensive customer information
- **Order History**: Track all customer orders and spending
- **Status Classification**: Categorize customers (Active, Inactive, VIP)
- **Analytics**: Customer behavior and spending patterns

### Reporting & Analytics
- **Sales Analytics**: Revenue trends and performance metrics
- **Inventory Reports**: Stock levels and turnover analysis
- **Customer Insights**: Customer acquisition and retention metrics
- **Export Capabilities**: Generate reports in various formats

## ERP Principles Implemented

1. **Integration**: All modules (Orders, Inventory, Customers) are interconnected
2. **Real-time Data**: Live updates across all system components
3. **Process Automation**: Automated workflows for order processing
4. **Data Consistency**: Centralized data management
5. **Scalability**: Modular architecture for easy expansion
6. **User Experience**: Intuitive interface for efficient operations

## Future Enhancements

- [ ] User authentication and role-based access
- [ ] Advanced reporting with custom date ranges
- [ ] Email notifications for order status changes
- [ ] Barcode scanning integration
- [ ] Mobile responsive design
- [ ] API endpoints for external integrations
- [ ] Data persistence with database integration
- [ ] Multi-language support
- [ ] Advanced search and filtering
- [ ] Bulk operations for inventory and orders

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository. 