import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowDown,
  ArrowRight,
  Check,
  ChevronDown,
  Heart,
  Menu,
  Moon,
  Search,
  ShoppingBag,
  Sparkles,
  Sun,
  X,
  Star,
  Quote,
  Building2,
  Upload,
  Ruler,
  Truck,
  ShieldCheck,
} from 'lucide-react';
import {
  CATEGORIES,
  CUSTOMER_REVIEWS,
  DEALS_PRODUCTS,
  FEATURED_COLLECTIONS,
  OCCASIONS,
  REAL_SPACES,
  TRENDING_PRODUCTS,
} from './data/storeData';
import { CartItem, Product } from './types';
import { CartDrawer } from './components/CartDrawer';
import { CustomizeModal } from './components/CustomizeModal';
import { QuoteModal } from './components/QuoteModal';

const nav = [
  ['Collections', 'collections'],
  ['Shop', 'shop'],
  ['Occasions', 'occasions'],
  ['Business', 'business'],
];

export default function App() {
  const [dark, setDark] = useState(
    () => localStorage.getItem('canvas-mode') === 'dark'
  );

  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [cartOpen, setCartOpen] = useState(false);
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [customizeOpen, setCustomizeOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] =
    useState<Product | null>(null);
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [wishlistIds, setWishlistIds] = useState<string[]>([
    'prod-1',
    'prod-2',
  ]);

  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      product: TRENDING_PRODUCTS[0],
      quantity: 1,
      size: '12x18 inch',
      finish: 'Matte Canvas',
    },
  ]);

  useEffect(() => {
    document.documentElement.classList.toggle('canvas-dark', dark);
    localStorage.setItem('canvas-mode', dark ? 'dark' : 'light');
  }, [dark]);

  const results = useMemo(() => {
    const q = search.trim().toLowerCase();

    if (!q) return [];

    return TRENDING_PRODUCTS.filter(p =>
      `${p.name} ${p.category} ${p.description}`
        .toLowerCase()
        .includes(q)
    ).slice(0, 5);
  }, [search]);

  const scrollTo = (id: string) =>
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: 'smooth' });

  const openCustomize = (product?: Product) => {
    setSelectedProduct(product || TRENDING_PRODUCTS[0]);
    setCustomizeOpen(true);
  };

  const addToCart = (product: Product) => {
    setCartItems(prev => {
      const idx = prev.findIndex(
        i => i.product.id === product.id
      );

      if (idx >= 0) {
        const copy = [...prev];

        copy[idx] = {
          ...copy[idx],
          quantity: copy[idx].quantity + 1,
        };

        return copy;
      }

      return [
        ...prev,
        {
          product,
          quantity: 1,
          size: product.sizes?.[0] || '12x18 inch',
          finish:
            product.finishes?.[0] || 'Standard Finish',
        },
      ];
    });

    setCartOpen(true);
  };

  const handleCustomized = (item: any) => {
    setCartItems(prev => [
      ...prev,
      {
        product: item.product,
        quantity: item.quantity,
        size: item.size,
        finish: item.finish,
        customText: item.customText,
        photoUrl: item.photoUrl,
      },
    ]);

    setCartOpen(true);
  };

  const handleWorkbench = (item: any) => {
    const product: Product = {
      id: `custom-${Date.now()}`,
      name: item.name,
      category: item.material.toUpperCase(),
      categorySlug: item.material,
      price: item.price,
      originalPrice: Math.round(item.price * 1.3),
      discountPercent: 25,
      rating: 5,
      reviewsCount: 1,
      image: item.image,
      sizes: [item.size],
      finishes: [item.finish],
      badge: 'Custom',
      description:
        'Custom personalized print with customized dimensions, finish and text.',
    };

    setCartItems(prev => [
      ...prev,
      {
        product,
        quantity: 1,
        size: item.size,
        finish: item.finish,
        customText: item.text,
        photoUrl: item.image,
      },
    ]);

    setCartOpen(true);
  };

  const handleCategory = (slug: string) => {
    if (
      ['corporate', 'corporate-orders', 'bulk-order'].includes(
        slug
      )
    ) {
      scrollTo('business');
    } else if (
      ['gifts', 'festivals', 'occasions'].includes(slug)
    ) {
      scrollTo('occasions');
    } else if (slug === 'custom-prints') {
      openCustomize();
    } else {
      scrollTo('shop');
    }
  };

  return (
    <div className={`ci-site ${dark ? 'is-dark' : 'is-light'}`}>
      <div className="ci-grain" />

      {/* ==================== HEADER ==================== */}

      <header className="ci-header">

        <div className="ci-header-inner">

          {/* HEADER LOGO
              Light mode = light logo
              Dark mode = same logo used in footer
          */}

          <button
            className="ci-logo"
            onClick={() => scrollTo('top')}
            aria-label="Canvas India home"
          >
            <img
              src={
                dark
                  ? '/Codex Image 6 Sept 2026, 10_11_12.png'
                  : '/canvas-india-logo-transparent.png'
              }
              alt="Canvas India"
            />
          </button>

          <nav className="ci-nav desktop-only">

            {nav.map(([label, id]) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
              >
                {label}
                <ChevronDown size={12} />
              </button>
            ))}

          </nav>

          <div className="ci-actions">

            <button
              className="icon-btn desktop-only"
              onClick={() =>
                setSearchOpen(v => !v)
              }
              aria-label="Search"
            >
              <Search size={17} />
            </button>

            <button
              className="icon-btn"
              onClick={() =>
                setDark(v => !v)
              }
              aria-label="Toggle dark mode"
            >
              {dark ? (
                <Sun size={17} />
              ) : (
                <Moon size={17} />
              )}
            </button>

            <button
              className="bag-btn"
              onClick={() => setCartOpen(true)}
            >
              <ShoppingBag size={17} />
              <span>
                {cartItems.reduce(
                  (n, i) => n + i.quantity,
                  0
                )}
              </span>
            </button>

            <button
              className="mobile-menu-btn"
              onClick={() =>
                setMenuOpen(v => !v)
              }
            >
              {menuOpen ? <X /> : <Menu />}
            </button>

          </div>

        </div>

        {searchOpen && (
          <div className="search-panel">

            <Search size={17} />

            <input
              autoFocus
              value={search}
              onChange={e =>
                setSearch(e.target.value)
              }
              placeholder="Search canvas, acrylic, cork, gifts..."
            />

            {search && (
              <button
                onClick={() => setSearch('')}
              >
                <X size={15} />
              </button>
            )}

            {results.length > 0 && (
              <div className="search-results">

                {results.map(p => (
                  <button
                    key={p.id}
                    onClick={() => {
                      openCustomize(p);
                      setSearchOpen(false);
                    }}
                  >

                    <img
                      src={p.image}
                      alt={p.name}
                    />

                    <span>
                      <b>{p.name}</b>
                      <small>
                        {p.category} · ₹{p.price}
                      </small>
                    </span>

                    <ArrowRight size={15} />

                  </button>
                ))}

              </div>
            )}

          </div>
        )}

        {menuOpen && (
          <div className="mobile-menu">

            {nav.map(([label, id]) => (
              <button
                key={id}
                onClick={() => {
                  scrollTo(id);
                  setMenuOpen(false);
                }}
              >
                {label}
                <ArrowRight size={15} />
              </button>
            ))}

            <button
              onClick={() => {
                openCustomize();
                setMenuOpen(false);
              }}
            >
              Start creating
              <ArrowRight size={15} />
            </button>

          </div>
        )}

      </header>

      {/* ==================== MAIN ==================== */}

      <main id="top">

        <section className="ci-hero">

          <div className="hero-image">

            <img
              src="https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=1800&auto=format&fit=crop&q=85"
              alt="Canvas artwork"
            />

            <div className="hero-wash" />

          </div>

          <div className="hero-copy">

            <p className="eyebrow">
              Personalised art · Made in India
            </p>

            <h1>
              Turn the moments
              <br />
              <em>you keep</em> into
              <br />
              the things you see.
            </h1>

            <p className="hero-sub">
              Museum-quality canvas, acrylic, cork and
              framed prints made from your photographs,
              ideas and stories.
            </p>

            <div className="hero-cta">

              <button
                className="btn-solid"
                onClick={() => openCustomize()}
              >
                Start creating
                <ArrowRight size={17} />
              </button>

              <button
                className="btn-ghost"
                onClick={() => scrollTo('shop')}
              >
                Explore the collection
              </button>

            </div>

          </div>

          <div className="hero-index">
            01 <span>/</span> 08
          </div>

          <button
            className="hero-scroll"
            onClick={() => scrollTo('intro')}
          >
            <span>Scroll to explore</span>
            <ArrowDown size={16} />
          </button>

        </section>

        <section
          id="intro"
          className="ci-intro editorial-grid"
        >

          <div className="intro-number">
            02
          </div>

          <div className="intro-statement">

            <p className="eyebrow">
              More than a print
            </p>

            <h2>
              Your walls should feel like <em>you.</em>
            </h2>

          </div>

          <div className="intro-copy">

            <p>
              From a single photograph to an entire
              gallery wall, Canvas India turns digital
              memories into tactile pieces designed
              for Indian homes, workspaces and
              celebrations.
            </p>

            <button
              className="text-link"
              onClick={() =>
                scrollTo('collections')
              }
            >
              Discover our collections
              <ArrowRight size={16} />
            </button>

          </div>

        </section>

        <section
          id="collections"
          className="ci-collections"
        >

          <div className="section-head">

            <div>

              <p className="eyebrow">
                03 / Collections
              </p>

              <h2>
                Made for every
                <br />
                <em>kind of memory.</em>
              </h2>

            </div>

            <p>
              Explore the materials, formats and
              collections that make up Canvas India.
            </p>

          </div>

          <div className="collection-mosaic">

            {CATEGORIES.slice(0, 7).map((c, i) => (
              <button
                key={c.id}
                className={`collection-tile tile-${i}`}
                onClick={() =>
                  handleCategory(c.slug)
                }
              >

                <img
                  src={c.image}
                  alt={c.name}
                />

                <div className="tile-overlay" />

                <div className="tile-info">

                  <span>0{i + 1}</span>

                  <div>

                    <h3>{c.name}</h3>

                    <p>
                      From ₹{c.startingPrice}
                    </p>

                  </div>

                  <ArrowRight size={18} />

                </div>

              </button>
            ))}

          </div>

        </section>

        <section
          id="shop"
          className="ci-shop"
        >

          <div className="shop-top">

            <div>

              <p className="eyebrow">
                04 / The edit
              </p>

              <h2>
                Customer favourites,
                <br />
                <em>beautifully made.</em>
              </h2>

            </div>

            <button
              className="text-link"
              onClick={() =>
                setShowAllProducts(v => !v)
              }
              aria-expanded={showAllProducts}
              aria-controls="product-edit-grid"
            >
              {showAllProducts
                ? 'Show featured products'
                : 'View all products'}
              <ArrowRight size={16} />
            </button>

          </div>

          <div
            id="product-edit-grid"
            className={`product-editorial-grid ${
              showAllProducts ? 'is-expanded' : ''
            }`}
          >

            {(showAllProducts
              ? TRENDING_PRODUCTS
              : TRENDING_PRODUCTS.slice(0, 6)
            ).map((p, i) => (

              <article
                className={`editorial-product p-${i}`}
                key={p.id}
              >

                <button
                  className={`product-image ${
                    p.id === 'prod-1'
                      ? 'product-image-featured'
                      : ''
                  }`}
                  onClick={() =>
                    openCustomize(p)
                  }
                >

                  <img
                    src={p.image}
                    alt={p.name}
                    onError={e => {
                      const img = e.currentTarget;

                      img.style.display = 'none';

                      img.parentElement?.classList.add(
                        'image-fallback'
                      );
                    }}
                  />

                  <span>{p.badge}</span>

                  {p.id === 'prod-1' && (
                    <div
                      className="product-fallback-art"
                      aria-hidden="true"
                    >
                      <i></i>

                      <b>
                        CANVAS
                        <br />
                        PRINT
                      </b>
                    </div>
                  )}

                </button>

                <div className="product-meta">

                  <div>

                    <p>{p.category}</p>

                    <h3>{p.name}</h3>

                  </div>

                  <strong>
                    ₹{p.price.toLocaleString('en-IN')}
                  </strong>

                </div>

                <div className="product-bottom">

                  <span>
                    <Star
                      size={12}
                      fill="currentColor"
                    />
                    {p.rating} · {p.reviewsCount} reviews
                  </span>

                  <button
                    onClick={() =>
                      addToCart(p)
                    }
                  >
                    Add to bag
                    <ArrowRight size={13} />
                  </button>

                </div>

              </article>

            ))}

          </div>

          <div className="shop-result-note">

            <span>
              {showAllProducts
                ? `${TRENDING_PRODUCTS.length} products in the edit`
                : 'Showing 6 customer favourites'}
            </span>

            <button
              className="shop-toggle"
              onClick={() =>
                setShowAllProducts(v => !v)
              }
            >
              {showAllProducts
                ? 'Collapse edit'
                : 'Browse the full edit'}
              <ArrowRight size={13} />
            </button>

          </div>

        </section>

        <section className="ci-feature-strip">

          <div className="feature-photo">

            <img
              src={FEATURED_COLLECTIONS[0].image}
              alt="Photo memories"
            />

          </div>

          <div className="feature-copy">

            <p className="eyebrow">
              05 / The personal studio
            </p>

            <h2>
              Upload once.
              <br />
              <em>Make it yours.</em>
            </h2>

            <p>
              Choose a size, finish and format. Add a
              message, preview your design and turn a
              photo into something made to stay.
            </p>

            <div className="feature-points">

              <span>
                <Upload size={15} />
                Your photo
              </span>

              <span>
                <Ruler size={15} />
                Your size
              </span>

              <span>
                <Sparkles size={15} />
                Your finish
              </span>

            </div>

            <button
              className="btn-solid"
              onClick={() => openCustomize()}
            >
              Open the customizer
              <ArrowRight size={16} />
            </button>

          </div>

        </section>

        <section
          id="occasions"
          className="ci-occasions"
        >

          <div className="section-head centered">

            <p className="eyebrow">
              06 / Occasions
            </p>

            <h2>
              Give a memory
              <br />
              <em>somewhere to live.</em>
            </h2>

            <p>
              Birthdays, weddings, housewarmings,
              festivals and everyday gifting.
            </p>

          </div>

          <div className="occasion-row">

            {OCCASIONS.slice(0, 6).map(o => (

              <button
                key={o.id}
                className="occasion-card"
                onClick={() =>
                  handleCategory(o.slug)
                }
              >

                <img
                  src={o.image}
                  alt={o.name}
                />

                <div>

                  <small>
                    {o.offerText}
                  </small>

                  <h3>{o.name}</h3>

                  <p>{o.tagline}</p>

                </div>

              </button>

            ))}

          </div>

        </section>

        <section className="ci-deal-band">

          <div>

            <p className="eyebrow">
              Limited edit
            </p>

            <h2>
              Make room for something
              <br />
              <em>worth keeping.</em>
            </h2>

            <p>
              Special prices on selected prints
              and ready-to-gift favourites.
            </p>

          </div>

          <div className="deal-cards">

            {DEALS_PRODUCTS.slice(0, 3).map(p => (

              <button
                key={p.id}
                className="mini-deal"
                onClick={() =>
                  openCustomize(p)
                }
              >

                <img
                  src={p.image}
                  alt={p.name}
                />

                <span>
                  {p.discountPercent}% off
                </span>

                <div>

                  <b>{p.name}</b>

                  <small>
                    ₹{p.price.toLocaleString('en-IN')}
                  </small>

                </div>

              </button>

            ))}

          </div>

        </section>

        <section className="ci-process">

          <div className="process-copy">

            <p className="eyebrow">
              07 / From screen to wall
            </p>

            <h2>
              A simple process.
              <br />
              <em>A finished piece.</em>
            </h2>

            <p>
              We keep the journey clear:
              choose, customise, approve and receive.
            </p>

            <button
              className="text-link"
              onClick={() =>
                openCustomize()
              }
            >
              Start your order
              <ArrowRight size={16} />
            </button>

          </div>

          <div className="process-steps">

            <div>
              <span>01</span>
              <h3>Choose</h3>
              <p>
                Pick canvas, acrylic, cork,
                frames or a curated print.
              </p>
            </div>

            <div>
              <span>02</span>
              <h3>Customise</h3>
              <p>
                Upload your image and set the
                size, finish and text.
              </p>
            </div>

            <div>
              <span>03</span>
              <h3>Approve</h3>
              <p>
                Preview the result before it
                goes into production.
              </p>
            </div>

            <div>
              <span>04</span>
              <h3>Unbox</h3>
              <p>
                Securely packed and delivered
                across India.
              </p>
            </div>

          </div>

        </section>

        <section
          id="business"
          className="ci-business"
        >

          <div className="business-image">

            <img
              src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1100&auto=format&fit=crop&q=85"
              alt="Corporate workspace"
            />

          </div>

          <div className="business-copy">

            <p className="eyebrow">
              Business / Corporate
            </p>

            <h2>
              Make your workplace
              <br />
              <em>feel considered.</em>
            </h2>

            <p>
              Reception boards, employee gifts,
              signage, event displays, branded wall
              art and bulk printing — supported from
              proofing to pan-India dispatch.
            </p>

            <div className="business-list">

              <span>
                <Check />
                Office branding
              </span>

              <span>
                <Check />
                Employee gifts
              </span>

              <span>
                <Check />
                Event displays
              </span>

              <span>
                <Check />
                Bulk printing
              </span>

              <span>
                <Check />
                Business signage
              </span>

              <span>
                <Check />
                Custom wall art
              </span>

            </div>

            <button
              className="btn-dark"
              onClick={() =>
                setQuoteOpen(true)
              }
            >
              Request a quote
              <ArrowRight size={16} />
            </button>

          </div>

        </section>

        <section className="ci-trust">

          <div className="section-head">

            <div>

              <p className="eyebrow">
                Why Canvas India
              </p>

              <h2>
                Details that make
                <br />
                <em>the difference.</em>
              </h2>

            </div>

            <p>
              Dependable Indian manufacturing,
              careful finishing and delivery designed
              around the way you actually buy.
            </p>

          </div>

          <div className="trust-grid">

            <div>
              <ShieldCheck />
              <b>Quality printing</b>
              <p>
                12-colour archival pigment inks for
                vivid, lasting colour.
              </p>
            </div>

            <div>
              <Sparkles />
              <b>Easy customisation</b>
              <p>
                Upload from your phone, add text and
                preview before ordering.
              </p>
            </div>

            <div>
              <Ruler />
              <b>Custom sizes</b>
              <p>
                From compact desk pieces to large
                architectural wall murals.
              </p>
            </div>

            <div>
              <Truck />
              <b>Pan-India delivery</b>
              <p>
                Insured doorstep shipping with live
                tracking across 19,000+ pin codes.
              </p>
            </div>

          </div>

        </section>

        <section className="ci-spaces">

          <div className="section-head centered">

            <p className="eyebrow">
              Real spaces
            </p>

            <h2>
              See it where life
              <br />
              <em>actually happens.</em>
            </h2>

          </div>

          <div className="space-mosaic">

            {REAL_SPACES.slice(0, 5).map((s, i) => (

              <div
                className={`space space-${i}`}
                key={s.id}
              >

                <img
                  src={s.image}
                  alt={s.title}
                />

                <div>

                  <small>
                    {s.spaceType}
                  </small>

                  <h3>{s.title}</h3>

                </div>

              </div>

            ))}

          </div>

        </section>

        <section className="ci-reviews">

          <div className="review-lead">

            <Quote size={34} />

            <p className="eyebrow">
              Customer notes
            </p>

            <h2>
              Made personal.
              <br />
              <em>Remembered.</em>
            </h2>

            <p>
              Real stories from people who turned
              photographs into pieces they wanted
              to keep.
            </p>

          </div>

          <div className="review-stack">

            {CUSTOMER_REVIEWS.slice(0, 4).map(
              (r, i) => (

                <article key={r.id}>

                  <div className="stars">
                    {'★★★★★'.slice(
                      0,
                      r.rating
                    )}
                  </div>

                  <p>
                    “{r.review}”
                  </p>

                  <footer>

                    <b>{r.name}</b>

                    <span>
                      {r.city} · {r.product}
                    </span>

                  </footer>

                </article>

              )
            )}

          </div>

        </section>

        <section className="ci-final">

          <div className="final-frame">

            <p className="eyebrow">
              Made in India · Pan-India delivery
            </p>

            <h2>
              Some things are better
              <br />
              <em>when they become real.</em>
            </h2>

            <p>
              Turn your photos, ideas and designs
              into something you'll love seeing
              every day.
            </p>

            <div>

              <button
                className="btn-solid"
                onClick={() =>
                  openCustomize()
                }
              >
                Start creating
                <ArrowRight size={17} />
              </button>

              <button
                className="btn-ghost"
                onClick={() =>
                  scrollTo('collections')
                }
              >
                Explore products
              </button>

            </div>

          </div>

        </section>

      </main>

      {/* ==================== FOOTER ==================== */}

      <footer className="ci-footer">

        <div className="footer-brand">

          {/* FOOTER LOGO — UNCHANGED */}

          <img
            src="/Codex Image 6 Sept 2026, 10_11_12.png"
            alt="Canvas India"
          />

          <p>
            Personalised printing for memories,
            spaces and businesses.
          </p>

        </div>

        <div className="footer-links">

          <div>

            <b>Shop</b>

            <button
              onClick={() =>
                handleCategory('canvas')
              }
            >
              Canvas
            </button>

            <button
              onClick={() =>
                handleCategory('acrylic')
              }
            >
              Acrylic
            </button>

            <button
              onClick={() =>
                handleCategory('cork')
              }
            >
              Cork
            </button>

            <button
              onClick={() =>
                handleCategory('custom-prints')
              }
            >
              Custom prints
            </button>

          </div>

          <div>

            <b>Explore</b>

            <button
              onClick={() =>
                scrollTo('collections')
              }
            >
              Collections
            </button>

            <button
              onClick={() =>
                scrollTo('occasions')
              }
            >
              Occasions
            </button>

            <button
              onClick={() =>
                scrollTo('business')
              }
            >
              Corporate
            </button>

            <button
              onClick={() =>
                setQuoteOpen(true)
              }
            >
              Get a quote
            </button>

          </div>

          <div>

            <b>Support</b>

            <span>+91 98450 12345</span>
            <span>orders@canvasindia.in</span>
            <span>
              Free delivery above ₹999
            </span>
            <span>
              100% quality guarantee
            </span>

          </div>

        </div>

        <div className="footer-bottom">

          © {new Date().getFullYear()} Canvas India · Made in India

          <span>
            Privacy · Terms
          </span>

        </div>

      </footer>

      {/* ==================== MODALS ==================== */}

      <CartDrawer
        isOpen={cartOpen}
        onClose={() =>
          setCartOpen(false)
        }
        cartItems={cartItems}
        onUpdateQuantity={(id, q) =>
          setCartItems(prev =>
            prev.map(i =>
              i.product.id === id
                ? {
                    ...i,
                    quantity: q,
                  }
                : i
            )
          )
        }
        onRemoveItem={id =>
          setCartItems(prev =>
            prev.filter(
              i => i.product.id !== id
            )
          )
        }
        onCheckout={() => {
          alert(
            'Thank you for shopping with Canvas India! Checkout gateway initiated.'
          );

          setCartOpen(false);
        }}
      />

      <CustomizeModal
        isOpen={customizeOpen}
        onClose={() =>
          setCustomizeOpen(false)
        }
        product={selectedProduct}
        onAddToCartCustomized={
          handleCustomized
        }
      />

      <QuoteModal
        isOpen={quoteOpen}
        onClose={() =>
          setQuoteOpen(false)
        }
      />

    </div>
  );
}