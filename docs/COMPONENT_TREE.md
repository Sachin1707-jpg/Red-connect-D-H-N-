# 🌳 Component Tree Hierarchy - RedConnect

This document details the visual component hierarchy tree for RedConnect, outlining container relationships, layout nesting, and common primitives.

---

## 1. Visual Component Tree (Mermaid)

```mermaid
graph TD
    App[<App />] --> ReduxProvider[<Provider store={store} />]
    ReduxProvider --> RouterProvider[<RouterProvider router={router} />]
    
    RouterProvider --> PublicLayout[<PublicLayout />]
    RouterProvider --> DashboardLayout[<DashboardLayout />]
    RouterProvider --> AuthLayout[<AuthLayout />]

    PublicLayout --> Navbar[<Navbar />]
    PublicLayout --> PageContainer[<Outlet />]
    PublicLayout --> Footer[<Footer />]
    PublicLayout --> ToastContainer[<ToastContainer />]

    Navbar --> NavLogo[<NavLogo />]
    Navbar --> NavLinks[<NavLinks />]
    Navbar --> NotificationPopover[<NotificationPopover />]
    Navbar --> UserMenu[<UserMenu />]

    PageContainer --> LandingPage[<LandingPage />]
    PageContainer --> RequestsPage[<EmergencyRequestsPage />]

    RequestsPage --> FilterBar[<FilterBar />]
    RequestsPage --> RequestGrid[<RequestGrid />]
    RequestsPage --> Pagination[<Pagination />]

    RequestGrid --> RequestCard[<EmergencyRequestCard />]
    RequestCard --> BloodBadge[<BloodTypeBadge />]
    RequestCard --> UrgencyBadge[<Badge variant='danger' />]
    RequestCard --> PledgeBtn[<Button variant='emergency' />]

    DashboardLayout --> Sidebar[<Sidebar />]
    DashboardLayout --> DashHeader[<DashboardHeader />]
    DashboardLayout --> DashContent[<Outlet />]

    DashContent --> DonorDashboard[<DonorDashboardPage />]
    DashContent --> InventoryPage[<HospitalInventoryPage />]

    InventoryPage --> StockGrid[<StockMatrixGrid />]
    StockGrid --> StockRow[<BloodTypeStockRow />]
```

---

## 2. Text Component Representation

```
App
├── Provider (Redux Store)
└── RouterProvider
    ├── PublicLayout
    │   ├── Navbar
    │   │   ├── BrandLogo
    │   │   ├── NavLink (Requests, Blood Banks, Camps)
    │   │   ├── NotificationBell
    │   │   │   └── NotificationBadge
    │   │   └── UserAvatarDropdown
    │   ├── ToastContainer
    │   │   └── Toast (Emergency | Success | Error | Info)
    │   ├── Outlet (Page Views)
    │   │   ├── LandingPage
    │   │   │   ├── HeroSection
    │   │   │   ├── StatCounterGrid
    │   │   │   └── EmergencyRequestCarousel
    │   │   ├── EmergencyRequestsPage
    │   │   │   ├── FilterBar
    │   │   │   ├── BloodTypePillGroup
    │   │   │   ├── EmergencyRequestCard
    │   │   │   └── PledgeModal
    │   │   └── BloodBanksPage
    │   └── Footer
    │
    └── DashboardLayout
        ├── Sidebar (Role-adapted links)
        ├── TopDashboardHeader
        └── Outlet
            ├── DonorDashboardPage
            │   ├── StatusSwitch
            │   ├── StatCard
            │   └── ActivePledgesList
            └── HospitalInventoryPage
                ├── StockMatrixGrid
                │   └── BloodTypeStockRow
                └── CreateRequestModal
```
