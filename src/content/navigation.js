export const pages = [
  { name: 'Home', href: '/', key: 'home' },
  { name: 'Shop', href: '/shop.html', key: 'shop' },
  { name: 'Categories', href: '/categories.html', key: 'categories' },
  { name: 'About Us', href: '/about.html', key: 'about' },
  { name: 'Blog', href: '/blog.html', key: 'blog' },
  { name: 'Contact', href: '/contact.html', key: 'contact' },
]
export const currentPage = pathname => pages.find(page => page.href === pathname || (page.key === 'home' && pathname === '/index.html'))
