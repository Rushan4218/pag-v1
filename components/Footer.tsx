export default function Footer() {
  return (
    <footer className="text-white py-12" style={{ backgroundColor: '#040404' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4" style={{ color: '#e1e1e1' }}>Thangka Art</h3>
            <p style={{ color: '#b3b3b3' }}>
              Explore our curated collection of authentic Thangka art pieces.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4" style={{ color: '#e1e1e1' }}>Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/products" className="transition-colors" style={{ color: '#b3b3b3' }} onMouseEnter={(e) => e.currentTarget.style.color = '#e1e1e1'} onMouseLeave={(e) => e.currentTarget.style.color = '#b3b3b3'}>
                  Products
                </a>
              </li>
              <li>
                <a href="/categories" className="transition-colors" style={{ color: '#b3b3b3' }} onMouseEnter={(e) => e.currentTarget.style.color = '#e1e1e1'} onMouseLeave={(e) => e.currentTarget.style.color = '#b3b3b3'}>
                  Categories
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4" style={{ color: '#e1e1e1' }}>Contact</h3>
            <p style={{ color: '#b3b3b3' }}>Contact us via WhatsApp on product pages</p>
          </div>
        </div>
        <div className="border-t mt-8 pt-8 text-center" style={{ borderColor: '#333333', color: '#b3b3b3' }}>
          <p>&copy; 2026 Phenomenal Art Gallery. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
