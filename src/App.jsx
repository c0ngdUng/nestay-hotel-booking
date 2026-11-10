import { useEffect, useMemo, useState } from 'react'
import { Link, NavLink, Route, Routes, useLocation, useNavigate, useParams, useSearchParams } from 'react-router'
import { ArrowLeft, ArrowRight, BedDouble, CalendarDays, Check, ChevronDown, Heart, MapPin, Menu, Search, ShieldCheck, SlidersHorizontal, Sparkles, Star, Users, Wifi, X } from 'lucide-react'
import { hotels, locations, money } from './data/hotels.js'

const bookingKey = 'nestay-bookings-v1'
const today = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}` }
const nextDay = value => { const d = new Date(`${value}T12:00:00`); d.setDate(d.getDate()+1); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}` }
const nightsBetween = (start, end) => Math.max(0, Math.round((new Date(`${end}T12:00:00`) - new Date(`${start}T12:00:00`)) / 86400000))
const loadBookings = () => {
  try { return JSON.parse(localStorage.getItem(bookingKey) || '[]') } catch { return [] }
}

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { pathname } = useLocation()
  useEffect(() => setMenuOpen(false), [pathname])
  return <header className="site-header">
    <div className="container header-inner">
      <Link className="brand" to="/" aria-label="NÉSTAY - Trang chủ"><span className="brand-mark">N<span>✳</span></span><span>NÉSTAY<small>STAY A LITTLE LONGER</small></span></Link>
      <nav className={menuOpen ? 'main-nav open' : 'main-nav'} aria-label="Điều hướng chính">
        <NavLink to="/" end>Trang chủ</NavLink><NavLink to="/rooms">Khám phá</NavLink><NavLink to="/about-us">Về chúng tôi</NavLink><NavLink to="/contact">Liên hệ</NavLink>
        <Link className="mobile-booking" to="/bookings">Đơn đặt phòng</Link>
      </nav>
      <Link className="header-cta" to="/bookings">Đơn đặt phòng <ArrowRight size={16}/></Link>
      <button className="menu-toggle" type="button" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'Đóng menu' : 'Mở menu'} aria-expanded={menuOpen}>{menuOpen ? <X/> : <Menu/>}</button>
    </div>
  </header>
}

function Footer() {
  return <footer className="footer"><div className="container">
    <div className="footer-top"><div><Link className="brand footer-brand" to="/"><span className="brand-mark">N<span>✳</span></span><span>NÉSTAY<small>STAY A LITTLE LONGER</small></span></Link><p>Thêm một chút bình yên vào mỗi hành trình.</p></div>
      <div><h4>Khám phá</h4><Link to="/rooms">Tất cả nơi lưu trú</Link><Link to="/about-us">Về NÉSTAY</Link></div>
      <div><h4>Hỗ trợ</h4><Link to="/contact">Liên hệ</Link><Link to="/bookings">Đơn đặt phòng</Link></div>
      <div><h4>Bản demo đồ án</h4><p>Dữ liệu lưu trú và giá chỉ mang tính minh họa. Yêu cầu đặt phòng được lưu trong trình duyệt.</p></div>
    </div><div className="footer-bottom"><span>© {new Date().getFullYear()} NÉSTAY. Project demo.</span><span>Made for memorable stays ✳</span></div>
  </div></footer>
}

function SearchForm({ compact = false }) {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [destination, setDestination] = useState(params.get('destination') || '')
  const [checkIn, setCheckIn] = useState(params.get('checkIn') || '')
  const [checkOut, setCheckOut] = useState(params.get('checkOut') || '')
  const [guests, setGuests] = useState(params.get('guests') || '2')
  function submit(event) {
    event.preventDefault()
    const fields = event.currentTarget.elements
    const destination = fields.destination.value
    const checkIn = fields.checkIn.value
    const checkOut = fields.checkOut.value
    const guests = fields.guests.value
    if (checkIn && checkOut && nightsBetween(checkIn, checkOut) < 1) { fields.checkOut.setCustomValidity('Ngày trả phòng phải sau ngày nhận phòng.'); fields.checkOut.reportValidity(); return }
    const query = new URLSearchParams()
    if (destination) query.set('destination', destination)
    if (checkIn) query.set('checkIn', checkIn)
    if (checkOut) query.set('checkOut', checkOut)
    query.set('guests', guests)
    navigate(`/rooms?${query}`)
  }
  return <form className={`search-form ${compact ? 'compact' : ''}`} onSubmit={submit}>
    <label className="search-field destination"><span><MapPin size={17}/> Điểm đến</span><select name="destination" value={destination} onChange={event => setDestination(event.target.value)}><option value="">Bạn muốn đi đâu?</option>{locations.map(place => <option key={place}>{place}</option>)}</select></label>
    <label className="search-field"><span><CalendarDays size={17}/> Nhận phòng</span><input name="checkIn" aria-label="Ngày nhận phòng" type="date" min={today()} defaultValue={checkIn} onChange={event => { setCheckIn(event.target.value); if (checkOut && event.target.value >= checkOut) { event.target.form.elements.checkOut.value = ''; setCheckOut('') } }} /></label>
    <label className="search-field"><span><CalendarDays size={17}/> Trả phòng</span><input name="checkOut" aria-label="Ngày trả phòng" type="date" min={checkIn ? nextDay(checkIn) : today()} defaultValue={checkOut} onChange={event => { event.target.setCustomValidity(''); setCheckOut(event.target.value) }} /></label>
    <label className="search-field guests"><span><Users size={17}/> Số khách</span><select name="guests" value={guests} onChange={event => setGuests(event.target.value)}>{[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} khách</option>)}</select></label>
    <button className="search-button" type="submit"><Search size={19}/><span>Tìm nơi lưu trú</span></button>
  </form>
}

function HotelCard({ hotel, query = '' }) {
  const url = `/rooms/${hotel.slug}${query}`
  return <article className="hotel-card"><Link className="card-image" to={url} aria-label={`Xem ${hotel.name}`}><img src={hotel.image} alt={`Không gian nghỉ tại ${hotel.name}`} loading="lazy"/><span className="card-tag">{hotel.tag}</span></Link>
    <div className="card-content"><div className="card-location"><MapPin size={14}/>{hotel.area}, {hotel.location}</div><div className="card-title-row"><h3><Link to={url}>{hotel.name}</Link></h3><span className="rating"><Star size={14} fill="currentColor"/> {hotel.rating}</span></div>
      <div className="card-meta">{hotel.type} <span>·</span> {hotel.guests} khách <span>·</span> {hotel.beds} giường</div><div className="card-bottom"><div><strong>{money(hotel.price)}</strong><span> / đêm</span></div><Link aria-label={`Chi tiết ${hotel.name}`} to={url} className="round-arrow"><ArrowRight size={18}/></Link></div></div>
  </article>
}

function Home() {
  return <main>
    <section className="hero"><div className="hero-photo" role="img" aria-label="Phòng nghỉ ấm áp với ánh sáng tự nhiên"/><div className="hero-shade"/><div className="container hero-content"><div className="eyebrow light"><span className="eyebrow-line"/> YOUR NEXT CHAPTER STARTS HERE</div><h1>Mỗi chuyến đi,<br/><em>một chốn để nhớ.</em></h1><p>Khám phá những không gian lưu trú đầy cảm hứng cho hành trình của riêng bạn.</p><Link className="hero-link" to="/rooms">Khám phá ngay <ArrowRight size={18}/></Link></div><div className="hero-index">01 <span>/</span> 03</div></section>
    <div className="container search-wrap"><SearchForm/></div>
    <section className="intro-strip container"><div className="intro-icon"><Sparkles size={22}/></div><p>Chúng tôi tin rằng nơi bạn ở cũng là một phần của hành trình. <strong>Chọn một chốn thật hợp với bạn.</strong></p><span>✳ &nbsp; NÉSTAY COLLECTION</span></section>
    <section className="section container"><div className="section-heading"><div><div className="eyebrow">CURATED STAYS</div><h2>Ở đâu cũng thấy <em>như nhà.</em></h2><p>Những lựa chọn lưu trú nổi bật cho cảm hứng xê dịch tiếp theo.</p></div><Link className="text-link" to="/rooms">Xem tất cả <ArrowRight size={18}/></Link></div><div className="hotel-grid">{hotels.slice(0, 3).map(h => <HotelCard key={h.slug} hotel={h}/>)}</div></section>
    <section className="feature-section"><div className="container feature-grid"><div className="feature-visual"><img src="https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=1200&q=85" alt="Không gian khách sạn sáng và thư thái" loading="lazy"/><div className="visual-note"><span>✳</span> Một chốn nghỉ, ngàn cảm hứng</div></div><div className="feature-copy"><div className="eyebrow">WHY NÉSTAY</div><h2>Để mỗi kỳ nghỉ<br/><em>thật trọn vẹn.</em></h2><p>Chúng tôi giúp bạn khám phá không gian phù hợp với nhịp điệu của mình, từ một cuối tuần thong thả đến chuyến đi cùng những người thân yêu.</p><div className="feature-list"><div><span><Heart size={20}/></span><div><h3>Lựa chọn đầy cảm hứng</h3><p>Khám phá nhiều kiểu lưu trú và điểm đến trong cùng một nơi.</p></div></div><div><span><ShieldCheck size={20}/></span><div><h3>Thông tin dễ theo dõi</h3><p>Xem giá tham khảo, tiện nghi và chi tiết phòng trước khi gửi yêu cầu.</p></div></div></div><Link className="button dark" to="/about-us">Tìm hiểu về chúng tôi <ArrowRight size={17}/></Link></div></div></section>
    <section className="container destination-section"><div className="section-heading"><div><div className="eyebrow">GO SOMEWHERE NEW</div><h2>Đi đâu <em>tiếp theo?</em></h2><p>Để những điểm đến đẹp mở đầu câu chuyện của bạn.</p></div></div><div className="destinations"><Link to="/rooms?destination=Đà+Nẵng" className="destination-tile beach"><span>01 / BIỂN XANH</span><strong>Đà Nẵng</strong><ArrowRight/></Link><Link to="/rooms?destination=Đà+Lạt" className="destination-tile mountain"><span>02 / ĐỒI THÔNG</span><strong>Đà Lạt</strong><ArrowRight/></Link><Link to="/rooms?destination=Phú+Quốc" className="destination-tile island"><span>03 / ĐẢO NGỌC</span><strong>Phú Quốc</strong><ArrowRight/></Link></div></section>
    <section className="closing-banner"><div className="container"><span>YOUR STAY, YOUR STORY</span><h2>Chuyến đi đẹp bắt đầu<br/>từ một <em>chốn dừng chân.</em></h2><Link className="button light-button" to="/rooms">Tìm phòng ngay <ArrowRight size={17}/></Link></div></section>
  </main>
}

function Rooms() {
  const [params, setParams] = useSearchParams()
  const destination = params.get('destination') || ''
  const guests = Number(params.get('guests') || 1)
  const [type, setType] = useState('Tất cả')
  const [sort, setSort] = useState('recommended')
  const filtered = useMemo(() => {
    const list = hotels.filter(h => (!destination || h.location === destination) && h.guests >= guests && (type === 'Tất cả' || h.type === type))
    return [...list].sort((a,b) => sort === 'low' ? a.price-b.price : sort === 'high' ? b.price-a.price : b.rating-a.rating)
  }, [destination, guests, type, sort])
  return <main><div className="page-banner"><div className="container"><div className="eyebrow">FIND YOUR PLACE</div><h1>Khám phá <em>chốn dừng chân.</em></h1><p>Chọn một nơi thật hợp cho chuyến đi sắp tới.</p></div></div><div className="container listing-search"><SearchForm key={params.toString()} compact/></div><section className="container listing-section"><div className="listing-top"><div><div className="eyebrow">THE COLLECTION</div><h2>{destination ? `Lưu trú tại ${destination}` : 'Tất cả nơi lưu trú'}</h2><p>{filtered.length} lựa chọn phù hợp với bạn</p></div><label className="sort-control">Sắp xếp <select value={sort} onChange={e => setSort(e.target.value)}><option value="recommended">Đánh giá cao</option><option value="low">Giá thấp trước</option><option value="high">Giá cao trước</option></select><ChevronDown size={16}/></label></div><div className="filters"><SlidersHorizontal size={18}/>{['Tất cả','Khách sạn','Villa','Resort','Căn hộ'].map(item => <button key={item} type="button" className={type === item ? 'active' : ''} onClick={() => setType(item)}>{item}</button>)}{destination && <button type="button" className="clear-filter" onClick={() => { const next = new URLSearchParams(params); next.delete('destination'); setParams(next) }}>Xóa điểm đến <X size={13}/></button>}</div>{filtered.length ? <div className="hotel-grid listing-grid">{filtered.map(h => <HotelCard key={h.slug} hotel={h} query={params.toString() ? `?${params}` : ''}/>)}</div> : <div className="empty-state"><Search size={30}/><h3>Chưa tìm thấy nơi phù hợp</h3><p>Thử thay đổi điểm đến, số khách hoặc loại lưu trú.</p><button className="button dark" onClick={() => { setType('Tất cả'); setParams({ guests: '1' }) }}>Xem tất cả nơi lưu trú</button></div>}</section></main>
}

function RoomDetail() {
  const { slug } = useParams()
  const hotel = hotels.find(item => item.slug === slug)
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [checkIn, setCheckIn] = useState(params.get('checkIn') || '')
  const [checkOut, setCheckOut] = useState(params.get('checkOut') || '')
  const [guests, setGuests] = useState(Math.min(Number(params.get('guests') || 2), hotel?.guests || 2))
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  if (!hotel) return <NotFound/>
  const nights = checkIn && checkOut ? nightsBetween(checkIn, checkOut) : 0
  function book(event) {
    event.preventDefault()
    const start = event.currentTarget.elements.checkIn.value
    const end = event.currentTarget.elements.checkOut.value
    const stayNights = start && end ? nightsBetween(start, end) : 0
    if (!start || !end || stayNights < 1 || start < today()) { setError('Vui lòng chọn ngày nhận và trả phòng hợp lệ.'); return }
    const booking = { id: crypto.randomUUID(), slug: hotel.slug, hotelName: hotel.name, image: hotel.image, location: hotel.location, checkIn: start, checkOut: end, guests: Number(guests), name: name.trim(), email: email.trim(), nights: stayNights, total: stayNights * hotel.price, createdAt: new Date().toISOString() }
    try { localStorage.setItem(bookingKey, JSON.stringify([booking, ...loadBookings()])) } catch { setError('Không thể lưu yêu cầu trên trình duyệt này. Hãy bật bộ nhớ trình duyệt và thử lại.'); return }
    navigate('/bookings?created=1')
  }
  return <main><div className="container detail-page"><div className="breadcrumbs"><Link to="/">Trang chủ</Link><span>/</span><Link to="/rooms">Khám phá</Link><span>/</span>{hotel.name}</div><div className="detail-heading"><div><div className="eyebrow">NÉSTAY COLLECTION</div><h1>{hotel.name}</h1><div className="detail-sub"><MapPin size={17}/>{hotel.area}, {hotel.location}<span>·</span><Star size={16} fill="currentColor" className="star"/>{hotel.rating} ({hotel.reviews} đánh giá minh họa)</div></div><Link className="back-link" to="/rooms"><ArrowLeft size={17}/> Xem nơi khác</Link></div><div className="detail-gallery"><img src={hotel.gallery[0]} alt={`Phòng nghỉ tại ${hotel.name}`}/><div><img src={hotel.gallery[1]} alt="Góc nhìn khác của nơi lưu trú"/><img src={hotel.gallery[2]} alt="Không gian tiện nghi của nơi lưu trú"/></div></div><div className="detail-layout"><div className="detail-main"><div className="detail-intro"><span className="pill">{hotel.type}</span><h2>Một nơi để <em>thật sự nghỉ ngơi.</em></h2><p>{hotel.description}</p><div className="detail-stats"><span><Users size={20}/>{hotel.guests} khách tối đa</span><span><BedDouble size={20}/>{hotel.beds} giường</span><span><Sparkles size={20}/>{hotel.size} m²</span></div></div><div className="amenities"><h2>Tiện nghi tại đây</h2><div>{hotel.amenities.map(a => <span key={a}>{a === 'Wi-Fi miễn phí' ? <Wifi size={18}/> : <Check size={18}/>} {a}</span>)}</div></div><div className="detail-note"><ShieldCheck size={23}/><div><strong>Lưu ý về bản demo</strong><p>Thông tin, giá và đánh giá chỉ để minh họa giao diện. Gửi yêu cầu sẽ lưu dữ liệu trên thiết bị của bạn, không tạo đặt phòng tại khách sạn.</p></div></div></div><aside className="booking-card"><div className="booking-price"><strong>{money(hotel.price)}</strong><span> / đêm</span></div><p>Chọn ngày lưu trú và gửi yêu cầu đặt phòng.</p><form onSubmit={book}><div className="booking-dates"><label>Nhận phòng<input name="checkIn" type="date" required min={today()} defaultValue={checkIn} onChange={e => { setCheckIn(e.target.value); if (checkOut && e.target.value >= checkOut) { e.target.form.elements.checkOut.value = ''; setCheckOut('') } setError('') }}/></label><label>Trả phòng<input name="checkOut" type="date" required min={checkIn ? nextDay(checkIn) : today()} defaultValue={checkOut} onChange={e => { setCheckOut(e.target.value); setError('') }}/></label></div><label>Số khách<select value={guests} onChange={e => setGuests(e.target.value)}>{Array.from({length: hotel.guests}, (_,i) => i+1).map(n => <option key={n} value={n}>{n} khách</option>)}</select></label><label>Họ và tên<input required maxLength="80" autoComplete="name" value={name} onChange={e => setName(e.target.value)} placeholder="Tên của bạn"/></label><label>Email<input required type="email" maxLength="120" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="ban@example.com"/></label>{nights > 0 && <div className="booking-total"><span>{money(hotel.price)} × {nights} đêm</span><strong>{money(nights * hotel.price)}</strong></div>}{error && <p className="form-error" role="alert">{error}</p>}<button className="button dark full" type="submit">Gửi yêu cầu <ArrowRight size={17}/></button></form><small>Không cần thanh toán trong bản demo.</small></aside></div></div></main>
}

function About() { return <main><div className="page-banner about-banner"><div className="container"><div className="eyebrow">OUR STORY</div><h1>Ở lại lâu hơn.<br/><em>Cảm nhận nhiều hơn.</em></h1><p>Một ý tưởng nhỏ về những hành trình đáng nhớ.</p></div></div><section className="container story-section"><div><div className="eyebrow">HELLO, WE'RE NÉSTAY</div><h2>Nơi lưu trú cũng là<br/><em>một phần câu chuyện.</em></h2></div><div><p>NÉSTAY là dự án website đặt phòng khách sạn được xây dựng cho môn học React. Giao diện giúp người dùng khám phá điểm đến, xem chi tiết nơi lưu trú và gửi yêu cầu đặt phòng qua một luồng đơn giản.</p><p>Chúng tôi chọn phong cách nhẹ nhàng, tập trung vào ảnh, thông tin dễ đọc và trải nghiệm thuận tiện trên cả máy tính lẫn điện thoại.</p></div></section><section className="container about-values"><div><span>01</span><h3>Khám phá</h3><p>Tìm nơi lưu trú theo điểm đến, số khách và loại phòng.</p></div><div><span>02</span><h3>Lựa chọn</h3><p>Xem tiện nghi, mức giá minh họa và chi tiết từng chỗ ở.</p></div><div><span>03</span><h3>Lên kế hoạch</h3><p>Lưu yêu cầu đặt phòng ngay trong trình duyệt để theo dõi.</p></div></section><section className="about-cta"><div className="container"><h2>Sẵn sàng cho chuyến đi <em>tiếp theo?</em></h2><Link className="button dark" to="/rooms">Khám phá nơi lưu trú <ArrowRight size={17}/></Link></div></section></main> }

function Contact() {
  const [sent, setSent] = useState(false)
  return <main><div className="page-banner"><div className="container"><div className="eyebrow">GET IN TOUCH</div><h1>Chúng tôi luôn <em>lắng nghe.</em></h1><p>Gửi ý kiến về trải nghiệm bản demo NÉSTAY.</p></div></div><section className="container contact-layout"><div><div className="eyebrow">SAY HELLO</div><h2>Có điều gì bạn<br/>muốn <em>chia sẻ?</em></h2><p>Đây là dự án học tập. Biểu mẫu chỉ mô phỏng tương tác trên giao diện và không gửi email tới nhóm phát triển.</p><div className="contact-callout"><Sparkles size={25}/><span>Hãy bắt đầu bằng việc khám phá một chốn nghỉ phù hợp với bạn.</span></div></div><div className="contact-form-card">{sent ? <div className="success-message"><span><Check size={28}/></span><h3>Cảm ơn bạn đã ghé thăm!</h3><p>Đây là biểu mẫu demo nên nội dung chưa được gửi đi.</p><button className="button dark" onClick={() => setSent(false)}>Viết lại</button></div> : <form onSubmit={e => { e.preventDefault(); setSent(true) }}><h3>Để lại lời nhắn</h3><label>Họ và tên<input required maxLength="80" placeholder="Tên của bạn"/></label><label>Email<input required type="email" maxLength="120" placeholder="ban@example.com"/></label><label>Nội dung<textarea required rows="5" maxLength="1000" placeholder="Bạn muốn chia sẻ điều gì?"/></label><button className="button dark full">Gửi lời nhắn <ArrowRight size={17}/></button></form>}</div></section></main>
}

function Bookings() {
  const [bookings, setBookings] = useState(loadBookings)
  const [params] = useSearchParams()
  function remove(id) { const next = bookings.filter(b => b.id !== id); setBookings(next); localStorage.setItem(bookingKey, JSON.stringify(next)) }
  return <main><div className="page-banner"><div className="container"><div className="eyebrow">YOUR PLANS</div><h1>Yêu cầu <em>đặt phòng.</em></h1><p>Xem lại các yêu cầu đã lưu trên trình duyệt này.</p></div></div><section className="container bookings-section">{params.has('created') && <div className="booking-alert"><Check size={19}/> Đã lưu yêu cầu đặt phòng trên thiết bị này. Đây chưa phải xác nhận từ khách sạn.</div>}{bookings.length ? <div className="booking-list">{bookings.map(b => <article className="booking-item" key={b.id}><img src={b.image} alt={b.hotelName}/><div><div className="eyebrow">YÊU CẦU DEMO</div><h2><Link to={`/rooms/${b.slug}`}>{b.hotelName}</Link></h2><p><MapPin size={15}/>{b.location} <span>·</span> {b.guests} khách</p><p><CalendarDays size={15}/>{new Date(`${b.checkIn}T12:00:00`).toLocaleDateString('vi-VN')} – {new Date(`${b.checkOut}T12:00:00`).toLocaleDateString('vi-VN')} ({b.nights} đêm)</p><p>Người gửi: {b.name} · {b.email}</p></div><div className="booking-item-side"><strong>{money(b.total)}</strong><small>Giá tham khảo</small><button type="button" onClick={() => remove(b.id)}>Xóa yêu cầu</button></div></article>)}</div> : <div className="empty-state"><CalendarDays size={34}/><h2>Chưa có yêu cầu nào</h2><p>Khám phá nơi lưu trú và bắt đầu lên kế hoạch cho chuyến đi.</p><Link className="button dark" to="/rooms">Khám phá phòng <ArrowRight size={17}/></Link></div>}</section></main>
}

function NotFound() { return <main className="not-found container"><span>404</span><h1>Hình như bạn đã đi lạc.</h1><p>Trang bạn tìm không tồn tại. Hãy quay lại và tiếp tục hành trình.</p><Link className="button dark" to="/">Về trang chủ <ArrowRight size={17}/></Link></main> }

export default function App() { return <><ScrollToTop/><Header/><Routes><Route path="/" element={<Home/>}/><Route path="/rooms" element={<Rooms/>}/><Route path="/rooms/:slug" element={<RoomDetail/>}/><Route path="/about-us" element={<About/>}/><Route path="/contact" element={<Contact/>}/><Route path="/bookings" element={<Bookings/>}/><Route path="*" element={<NotFound/>}/></Routes><Footer/></> }
