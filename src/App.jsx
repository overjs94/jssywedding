import { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'

import coverImage from './assets/cover_picture.jpg'
import gallery1 from './assets/gallery_1.jpg'
import gallery2 from './assets/gallery_2.jpg'
import gallery3 from './assets/gallery_3.jpg'
import gallery4 from './assets/gallery_4.jpg'
import gallery5 from './assets/gallery_5.jpg'
import gallery6 from './assets/gallery_6.jpg'
import gallery7 from './assets/gallery_7.jpg'
import gallery8 from './assets/gallery_8.jpg'
import gallery9 from './assets/gallery_9.jpg'
import gallery10 from './assets/gallery_10.jpg'
import gallery11 from './assets/gallery_11.jpg'
import gallery12 from './assets/gallery_12.jpg'
import gallery13 from './assets/gallery_13.jpg'
import gallery14 from './assets/gallery_14.jpg'
import gallery15 from './assets/gallery_15.jpg'
import gallery16 from './assets/gallery_16.jpg'
import gallery17 from './assets/gallery_17.jpg'
import gallery18 from './assets/gallery_18.jpg'
import bgmFile from './assets/존박-05-꿈처럼.mp3'

import tmapIcon from './assets/tmap.png'
import naverIcon from './assets/naver_map.png'
import kakaoIcon from './assets/kakao_navi.png'

import {
  Container,
  NavermapsProvider,
  NaverMap,
  Marker,
} from 'react-naver-maps'

const weddingDate = new Date('2026-06-20T15:00:00')

const VENUE = {
  lat: 37.457987,
  lng: 126.953806,
}

const VENUE_NAME = '서울대학교 교수회관'
const VENUE_ADDRESS = '서울특별시 관악구 관악로 1 서울대학교 65동'
const VENUE_LAT = 37.457987
const VENUE_LNG = 126.953806
const APP_NAME = encodeURIComponent(window.location.origin)

const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)

const openAppOrWeb = (appUrl, webUrl) => {
  if (!isMobile) {
    window.open(webUrl, '_blank')
    return
  }

  const clickedAt = Date.now()
  window.location.href = appUrl

  setTimeout(() => {
    if (Date.now() - clickedAt < 1800) {
      window.open(webUrl, '_blank')
    }
  }, 1200)
}

const openTmap = () => {
  const appUrl =
    `tmap://route?goalx=${VENUE_LNG}` +
    `&goaly=${VENUE_LAT}` +
    `&goalname=${encodeURIComponent(VENUE_NAME)}`

  const webUrl = 'https://www.tmap.co.kr/tmap2/mobile/route.jsp'
  openAppOrWeb(appUrl, webUrl)
}

const openNaverMap = () => {
  const appUrl =
    `nmap://place?lat=${VENUE_LAT}` +
    `&lng=${VENUE_LNG}` +
    `&name=${encodeURIComponent(VENUE_NAME)}` +
    `&appname=${APP_NAME}`

  const webUrl =
    `https://map.naver.com/p/search/${encodeURIComponent(VENUE_NAME)}`

  openAppOrWeb(appUrl, webUrl)
}

const openKakaoMap = () => {
  const appUrl =
    `kakaomap://search?q=${encodeURIComponent(VENUE_NAME)}` +
    `&p=${VENUE_LAT},${VENUE_LNG}`

  const webUrl =
    `http://m.map.kakao.com/scheme/search?q=${encodeURIComponent(VENUE_NAME)}` +
    `&p=${VENUE_LAT},${VENUE_LNG}`

  openAppOrWeb(appUrl, webUrl)
}

const galleryImages = [
  gallery1,
  gallery2,
  gallery3,
  gallery4,
  gallery5,
  gallery6,
  gallery7,
  gallery8,
  gallery9,
  gallery10,
  gallery11,
  gallery12,
  gallery13,
  gallery14,
  gallery15,
  gallery16,
  gallery17,
  gallery18,
]

function WeddingMap() {
  return (
    <div className="location-map-box">
      <NavermapsProvider ncpKeyId="o89suohmde">
        <Container
          style={{
            width: '100%',
            height: '280px',
          }}
        >
          <NaverMap
            defaultCenter={VENUE}
            defaultZoom={16}
            zoomControl={true}
          >
            <Marker position={VENUE} />
          </NaverMap>
        </Container>
      </NavermapsProvider>
    </div>
  )
}

function App() {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft(weddingDate))
  const [isMusicPlaying, setIsMusicPlaying] = useState(false)
  const [openGalleryIndex, setOpenGalleryIndex] = useState(null)
  const [showGroomAccount, setShowGroomAccount] = useState(false)
  const [showBrideAccount, setShowBrideAccount] = useState(false)
  const [showAllGallery, setShowAllGallery] = useState(false)

  const [dragOffset, setDragOffset] = useState(0)
  const [imageTransition, setImageTransition] = useState('transform 0.28s cubic-bezier(0.22, 1, 0.36, 1)')
  const [imageOpacity, setImageOpacity] = useState(1)

  const audioRef = useRef(null)
  const isDragging = useRef(false)
  const startXRef = useRef(0)
  const currentXRef = useRef(0)
  const startTimeRef = useRef(0)

  useEffect(() => {
    if (window.Kakao && !window.Kakao.isInitialized()) {
      window.Kakao.init('f5b77682cbcf78db381a09b926bed7bb')
    }
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft(weddingDate))
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (openGalleryIndex === null) return

      if (e.key === 'Escape') closeImage()
      if (e.key === 'ArrowRight') animateToAdjacent('next')
      if (e.key === 'ArrowLeft') animateToAdjacent('prev')
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [openGalleryIndex])

  const ddayText = useMemo(() => {
    if (timeLeft.total <= 0) return '결혼식이 시작되었습니다'
    return `결혼식이 ${timeLeft.days}일 남았습니다`
  }, [timeLeft])

  const toggleMusic = async () => {
    try {
      if (!audioRef.current) return

      if (isMusicPlaying) {
        audioRef.current.pause()
        setIsMusicPlaying(false)
      } else {
        await audioRef.current.play()
        setIsMusicPlaying(true)
      }
    } catch (error) {
      console.error(error)
      alert('브라우저 정책상 처음에는 버튼을 직접 눌러야 음악이 재생됩니다.')
    }
  }

  const visibleGalleryImages = showAllGallery
    ? galleryImages
    : galleryImages.slice(0, 9)

  const copyAccount = async (text) => {
    try {
      await navigator.clipboard.writeText(text)
      alert('계좌번호가 복사되었습니다.')
    } catch {
      alert('복사에 실패했습니다.')
    }
  }

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      alert('링크가 복사되었습니다.')
    } catch {
      alert('링크 복사에 실패했습니다.')
    }
  }

  const shareLink = async () => {
    const shareData = {
      title: '정섭 ♥ 소연 결혼식에 초대합니다',
      text: '모바일 청첩장을 확인해주세요.',
      url: window.location.href,
    }

    try {
      if (navigator.share) {
        await navigator.share(shareData)
      } else {
        await copyLink()
      }
    } catch (error) {
      console.error(error)
    }
  }

  const registerSchedule = () => {
    const title = encodeURIComponent('정섭 ♥ 소연 결혼식')
    const location = encodeURIComponent(VENUE_NAME)
    const details = encodeURIComponent('정섭 ♥ 소연 결혼식에 초대합니다.')
    const start = '20260620T150000'
    const end = '20260620T170000'

    const googleCalendarUrl =
      `https://calendar.google.com/calendar/render?action=TEMPLATE` +
      `&text=${title}&dates=${start}/${end}&details=${details}&location=${location}`

    window.open(googleCalendarUrl, '_blank')
  }

  const shareKakao = () => {
  if (!window.Kakao) {
    alert('카카오 SDK가 로드되지 않았습니다.')
    return
  }

  const shareUrl = 'https://overjs94.github.io/jssywedding/'
  const imageUrl = 'https://overjs94.github.io/jssywedding/kakao-share.jpg'

  if (!window.Kakao.isInitialized()) {
    window.Kakao.init('f5b77682cbcf78db381a09b926bed7bb')
  }

  window.Kakao.Share.sendDefault({
    objectType: 'feed',
    content: {
      title: '정섭 🤍 소연 결혼합니다',
      description: '2026.06.20 15시 00분 서울대학교 교수회관',
      imageUrl,
      link: {
        mobileWebUrl: shareUrl,
        webUrl: shareUrl,
      },
    },
    buttons: [
      {
        title: '청첩장 보기',
        link: {
          mobileWebUrl: shareUrl,
          webUrl: shareUrl,
        },
      },
    ],
  })
}

  const getPrevIndex = (index) =>
    index === null ? 0 : (index - 1 + galleryImages.length) % galleryImages.length

  const getNextIndex = (index) =>
    index === null ? 0 : (index + 1) % galleryImages.length

  const openImage = (index) => {
    setOpenGalleryIndex(index)
    setDragOffset(0)
    setImageOpacity(1)
    setImageTransition('transform 0.28s cubic-bezier(0.22, 1, 0.36, 1)')
    isDragging.current = false
  }

  const closeImage = () => {
    setOpenGalleryIndex(null)
    setDragOffset(0)
    setImageOpacity(1)
    isDragging.current = false
  }

  const applyRubberBand = (delta) => {
    const abs = Math.abs(delta)
    const sign = Math.sign(delta)

    if (abs <= 120) return delta * 0.9
    return sign * (108 + (abs - 120) * 0.22)
  }

  const animateToAdjacent = (direction) => {
    if (openGalleryIndex === null) return

    const viewportWidth = window.innerWidth || 430
    const exitOffset = direction === 'next' ? -viewportWidth * 0.42 : viewportWidth * 0.42
    const enterOffset = direction === 'next' ? viewportWidth * 0.18 : -viewportWidth * 0.18
    const nextIndex =
      direction === 'next' ? getNextIndex(openGalleryIndex) : getPrevIndex(openGalleryIndex)

    setImageTransition('transform 0.18s cubic-bezier(0.32, 0.72, 0, 1), opacity 0.18s ease')
    setDragOffset(exitOffset)
    setImageOpacity(0.82)

    setTimeout(() => {
      setOpenGalleryIndex(nextIndex)
      setImageTransition('none')
      setDragOffset(enterOffset)
      setImageOpacity(0.92)

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setImageTransition('transform 0.26s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.24s ease')
          setDragOffset(0)
          setImageOpacity(1)
        })
      })
    }, 160)
  }

  const snapBack = () => {
    setImageTransition('transform 0.34s cubic-bezier(0.22, 1, 0.36, 1)')
    setDragOffset(0)
    setImageOpacity(1)
  }

  const beginDrag = (clientX) => {
    isDragging.current = true
    startXRef.current = clientX
    currentXRef.current = clientX
    startTimeRef.current = performance.now()
    setImageTransition('none')
  }

  const moveDrag = (clientX) => {
    if (!isDragging.current) return

    currentXRef.current = clientX
    const rawDelta = clientX - startXRef.current
    const dampedDelta = applyRubberBand(rawDelta)
    const opacity = Math.max(0.84, 1 - Math.min(Math.abs(rawDelta) / 700, 0.16))

    setDragOffset(dampedDelta)
    setImageOpacity(opacity)
  }

  const endDrag = (clientX) => {
    if (!isDragging.current) return

    isDragging.current = false
    currentXRef.current = clientX

    const rawDelta = currentXRef.current - startXRef.current
    const elapsed = Math.max(performance.now() - startTimeRef.current, 1)
    const velocity = Math.abs(rawDelta) / elapsed
    const distanceThreshold = Math.min(110, (window.innerWidth || 430) * 0.18)
    const shouldMove = Math.abs(rawDelta) > distanceThreshold || velocity > 0.55

    if (!shouldMove) {
      snapBack()
      return
    }

    if (rawDelta < 0) {
      animateToAdjacent('next')
    } else {
      animateToAdjacent('prev')
    }
  }

  const handleTouchStart = (e) => {
    beginDrag(e.changedTouches[0].clientX)
  }

  const handleTouchMove = (e) => {
    moveDrag(e.changedTouches[0].clientX)
  }

  const handleTouchEnd = (e) => {
    endDrag(e.changedTouches[0].clientX)
  }

  const handleMouseDown = (e) => {
    beginDrag(e.clientX)
  }

  const handleMouseMove = (e) => {
    moveDrag(e.clientX)
  }

  const handleMouseUp = (e) => {
    endDrag(e.clientX)
  }

  const handleMouseLeave = (e) => {
    endDrag(e.clientX)
  }

  return (
    <div className="app">
      <audio ref={audioRef} src={bgmFile} loop />

      <div className="mobile-frame">
        <section className="cover">
          <img className="cover-img" src={coverImage} alt="cover" />
          <div className="cover-overlay" />

          <button className="music-button" onClick={toggleMusic}>
            {isMusicPlaying ? '♬' : '♪'}
          </button>

          <div className="cover-content">
            <p className="cover-invitation">Wedding Invitation</p>
            <p className="cover-date">2026.06.20 SAT 3:00 PM</p>
            <p className="cover-place">서울대학교 교수회관</p>
          </div>
        </section>

        <section className="section invitation-section">
          <div className="section-header">
            <p className="section-en">INVITATION</p>
            <h2 className="section-title">모시는 글</h2>
          </div>

          <p className="invitation-text">
            함께 걸어갈 인생의 길 위에
            <br />
            소중한 분들의 따뜻한 축복을 더하고자 합니다.
            <br />
            귀한 걸음 하시어 자리를 빛내주시면
            <br />
            더없는 기쁨으로 간직하겠습니다.
          </p>

          <div className="family-box">
            <p>이명근 · 이난주의 장남 <strong> 이정섭 </strong></p>
            <p>김치우 · 박점화의 장녀 <strong> 김소연 </strong></p>
          </div>
        </section>

        <section className="section countdown-section">
          <div className="section-header">
            <p className="section-en">WEDDING DAY</p>
            <h2 className="section-title">예식까지 남은 시간</h2>
          </div>

          <p className="dday-message">{ddayText}</p>

          <div className="countdown-grid">
            <CountdownCard label="DAY" value={timeLeft.days} />
            <CountdownCard label="HOUR" value={timeLeft.hours} />
            <CountdownCard label="MIN" value={timeLeft.minutes} />
            <CountdownCard label="SEC" value={timeLeft.seconds} />
          </div>
        </section>

        <section className="section gallery-section">
          <div className="section-header">
            <p className="section-en">GALLERY</p>
            <h2 className="section-title">갤러리</h2>
          </div>

          <div className="gallery-wrap">
            <div className="gallery-grid">
              {visibleGalleryImages.map((image, index) => {
                const actualIndex = index

                return (
                  <button
                    className="gallery-item"
                    key={`${actualIndex}-${index}`}
                    onClick={() => openImage(actualIndex)}
                  >
                    <img src={image} alt={`gallery-${actualIndex + 1}`} />
                  </button>
                )
              })}
            </div>

            {!showAllGallery && galleryImages.length > 9 && (
              <div className="gallery-fade" />
            )}
          </div>

          {galleryImages.length > 9 && (
            <div className="gallery-action">
              <button
                className="gallery-more-button"
                onClick={() => setShowAllGallery((prev) => !prev)}
              >
                {showAllGallery ? '접기' : '더보기'}
              </button>
            </div>
          )}
        </section>

        <section className="section location-section">
          <div className="section-header">
            <p className="section-en">LOCATION</p>
            <h2 className="section-title">오시는 길</h2>
          </div>

          <div className="location-card">
            <h3>{VENUE_NAME}</h3>
            <p>{VENUE_ADDRESS}</p>
          </div>

          <WeddingMap />

          <div className="map-button-group">
            <button className="map-button" onClick={openTmap}>
              <img src={tmapIcon} alt="티맵" />
              티맵
            </button>

            <button className="map-button" onClick={openNaverMap}>
              <img src={naverIcon} alt="네이버지도" />
              네이버지도
            </button>

            <button className="map-button" onClick={openKakaoMap}>
              <img src={kakaoIcon} alt="카카오맵" />
              카카오맵
            </button>
          </div>

          <div className="transport-box">
            <div className="transport-item">
              <h4 className="transport-title">대중교통</h4>

              <ul className="transport-list">
                <li>
                  2호선 낙성대역 4번 출구 → GS주유소 끼고 좌회전 후 장블랑제리 제과점 앞에서
                  <strong> 관악02-1번 </strong>
                  마을버스 승차 → 공동기기원 하차
                </li>
                <li>
                  2호선 서울대입구역 3번 출구 →
                  <strong> 5511번 </strong>
                  버스 승차 → 공동기기원 하차
                </li>
                <li>
                  신림선 관악산역 1번 출구 →
                  <strong> 5516번 </strong>
                  버스 승차 → 공동기기원 또는 교수회관입구 하차
                </li>
              </ul>

              <p className="transport-note transport-warning">
                ※ 예식장은 <strong>호암교수회관이 아니라 서울대학교 교수회관</strong>입니다.
              </p>
            </div>

            <div className="transport-item transport-item-centered">
              <h4 className="transport-title">자가용</h4>
              <p>내비게이션에서 ‘서울대학교 교수회관’을 검색 후 방문해 주세요.</p>
              <p className="transport-note transport-warning">
                ※ <strong>호암교수회관과 다른 장소</strong>이오니 방문 시 유의 부탁드립니다.
              </p>
            </div>

            <div className="transport-item transport-item-centered">
              <h4 className="transport-title">주차</h4>
              <p>예식장 주차장 이용 시 2시간 무료주차권이 제공됩니다.</p>
            </div>
          </div>
        </section>

        <section className="section account-section">
          <div className="section-header">
            <p className="section-en">ACCOUNT</p>
            <h2 className="section-title">마음 전하기</h2>
          </div>

          <div className="account-wrap">
            <div className={`account-card ${showGroomAccount ? 'open' : ''}`}>
              <button
                className="account-toggle"
                onClick={() => setShowGroomAccount(!showGroomAccount)}
              >
                <span>신랑측 계좌번호 보기</span>
                <span className={`account-arrow ${showGroomAccount ? 'open' : ''}`} />
              </button>

              <div className={`account-panel ${showGroomAccount ? 'open' : ''}`}>
                <div className="account-panel-inner">
                  <div className="account-row">
                    <div className="account-info">
                      <p className="account-name">신랑 이정섭</p>
                      <p className="account-number">국민은행 525202-01-109719</p>
                    </div>
                    <button
                      className="copy-button"
                      onClick={() => copyAccount('국민은행 525202-01-109719')}
                    >
                      복사하기
                    </button>
                  </div>

                  <div className="account-row">
                    <div className="account-info">
                      <p className="account-name">신랑 아버지 이명근</p>
                      <p className="account-number">신한은행 110-033-048300</p>
                    </div>
                    <button
                      className="copy-button"
                      onClick={() => copyAccount('신한은행 110-033-048300')}
                    >
                      복사하기
                    </button>
                  </div>

                  <div className="account-row">
                    <div className="account-info">
                      <p className="account-name">신랑 어머니 이난주</p>
                      <p className="account-number">신한은행 110-023-235370</p>
                    </div>
                    <button
                      className="copy-button"
                      onClick={() => copyAccount('신한은행 110-023-235370')}
                    >
                      복사하기
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className={`account-card ${showBrideAccount ? 'open' : ''}`}>
              <button
                className="account-toggle"
                onClick={() => setShowBrideAccount(!showBrideAccount)}
              >
                <span>신부측 계좌번호 보기</span>
                <span className={`account-arrow ${showBrideAccount ? 'open' : ''}`} />
              </button>

              <div className={`account-panel ${showBrideAccount ? 'open' : ''}`}>
                <div className="account-panel-inner">
                  <div className="account-row">
                    <div className="account-info">
                      <p className="account-name">신부 김소연</p>
                      <p className="account-number">우리은행 1002-455-820758</p>
                    </div>
                    <button
                      className="copy-button"
                      onClick={() => copyAccount('우리은행 1002-455-820758')}
                    >
                      복사하기
                    </button>
                  </div>

                  <div className="account-row">
                    <div className="account-info">
                      <p className="account-name">신부 아버지 김치우</p>
                      <p className="account-number">국민은행 911901-01-019696</p>
                    </div>
                    <button
                      className="copy-button"
                      onClick={() => copyAccount('국민은행 911901-01-019696')}
                    >
                      복사하기
                    </button>
                  </div>

                  <div className="account-row">
                    <div className="account-info">
                      <p className="account-name">신부 어머니 박점화</p>
                      <p className="account-number">우리은행 1002-000-675138</p>
                    </div>
                    <button
                      className="copy-button"
                      onClick={() => copyAccount('우리은행 1002-000-675138')}
                    >
                      복사하기
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section share-section">
          <div className="section-header">
            <p className="section-en">SHARE</p>
            <h2 className="section-title">함께 나누기</h2>
          </div>

          <div className="share-button-group">
            <button className="share-button" onClick={registerSchedule}>
              일정등록
            </button>
            <button className="share-button" onClick={copyLink}>
              링크복사
            </button>
            <button className="share-button" onClick={shareKakao}>
              카카오톡 공유
            </button>
            <button className="share-button" onClick={shareLink}>
              공유하기
            </button>
          </div>
        </section>
      </div>

      {openGalleryIndex !== null && (
        <div className="lightbox" onClick={closeImage}>
          <button
            className="lightbox-close"
            onClick={(e) => {
              e.stopPropagation()
              closeImage()
            }}
          >
            ×
          </button>

          <button
            className="lightbox-nav left"
            onClick={(e) => {
              e.stopPropagation()
              animateToAdjacent('prev')
            }}
          >
            ‹
          </button>

          <div
            className="lightbox-image-wrap"
            onClick={(e) => e.stopPropagation()}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <img
              className="lightbox-image"
              src={galleryImages[openGalleryIndex]}
              alt={`full-view-${openGalleryIndex + 1}`}
              draggable={false}
              style={{
                transform: `translate3d(${dragOffset}px, 0, 0) scale(${1 - Math.min(Math.abs(dragOffset) / 5000, 0.018)})`,
                transition: imageTransition,
                opacity: imageOpacity,
              }}
            />
          </div>

          <button
            className="lightbox-nav right"
            onClick={(e) => {
              e.stopPropagation()
              animateToAdjacent('next')
            }}
          >
            ›
          </button>
        </div>
      )}
    </div>
  )
}

function CountdownCard({ label, value }) {
  return (
    <div className="countdown-card">
      <div className="countdown-value">{String(value).padStart(2, '0')}</div>
      <div className="countdown-label">{label}</div>
    </div>
  )
}

function getTimeLeft(targetDate) {
  const now = new Date()
  const diff = targetDate - now

  if (diff <= 0) {
    return {
      total: 0,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    }
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
  const minutes = Math.floor((diff / (1000 * 60)) % 60)
  const seconds = Math.floor((diff / 1000) % 60)

  return {
    total: diff,
    days,
    hours,
    minutes,
    seconds,
  }
}

export default App