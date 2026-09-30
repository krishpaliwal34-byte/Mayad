'use client';

import React, { useState } from 'react';

import Link from 'next/link';

import { useRouter } from 'next/navigation';

import {

  User,

  Mail,

  Phone,

  Calendar,

  MapPin,

  Briefcase,

  Lock,

  Eye,

  EyeOff,

  Sparkles,

  ArrowRight,

  AlertCircle,

  RefreshCw,

  CheckCircle,

  ShieldCheck,

  ChevronDown,

  Film,

  Star,

} from 'lucide-react';

import '@/components/artist/artist-system.css';

const BACKEND_URL =

  process.env.NEXT_PUBLIC_BACKEND_URL || 'http\://localhost:5000';

const ROLE_CATEGORIES = [

  {

    category: 'Film & Production',

    roles: [

      'Director',

      'Assistant Director',

      'Producer',

      'Production Manager',

      'Cinematographer / DOP',

      'Assistant Cinematographer',

      'Video Editor',

      'Sound Designer',

    ],

  },

  {

    category: 'Acting & Talent',

    roles: [

      'Actor',

      'Actress',

      'Supporting Artist',

      'Voice Artist',

      'Casting Coordinator',

    ],

  },

  {

    category: 'Music',

    roles: [

      'Singer',

      'Music Director',

      'Composer',

      'Lyricist',

      'Music Producer',

    ],

  },

  {

    category: 'Creative',

    roles: [

      'Script Writer',

      'Story Writer',

      'Screenplay Writer',

      'Dialogue Writer',

      'Costume Designer',

      'Makeup Artist',

    ],

  },

];

const styles = {

  page: {

    minHeight: '100vh',

    background:

      'radial-gradient(circle at 10% 0%, rgba(245,180,40,.10), transparent 28%), radial-gradient(circle at 90% 20%, rgba(120,80,255,.09), transparent 25%), #05070d',

    color: '#fff',

    position: 'relative',

    overflow: 'hidden',

  },

  glowOne: {

    position: 'fixed',

    width: '420px',

    height: '420px',

    borderRadius: '50%',

    background: 'rgba(245,180,40,.06)',

    filter: 'blur(100px)',

    top: '-180px',

    left: '-120px',

    pointerEvents: 'none',

  },

  glowTwo: {

    position: 'fixed',

    width: '420px',

    height: '420px',

    borderRadius: '50%',

    background: 'rgba(104,77,255,.06)',

    filter: 'blur(110px)',

    right: '-160px',

    bottom: '-150px',

    pointerEvents: 'none',

  },

  nav: {

    height: '76px',

    borderBottom: '1px solid rgba(255,255,255,.07)',

    background: 'rgba(5,7,13,.78)',

    backdropFilter: 'blur(18px)',

    position: 'sticky',

    top: 0,

    zIndex: 50,

  },

  navInner: {

    maxWidth: '1240px',

    height: '100%',

    margin: '0 auto',

    padding: '0 24px',

    display: 'flex',

    alignItems: 'center',

    justifyContent: 'space-between',

  },

  logo: {

    display: 'flex',

    alignItems: 'center',

    gap: '11px',

    textDecoration: 'none',

    color: '#fff',

  },

  logoBox: {

    width: '42px',

    height: '42px',

    borderRadius: '12px',

    display: 'flex',

    alignItems: 'center',

    justifyContent: 'center',

    background:

      'linear-gradient(135deg, #f7c948 0%, #d99a17 50%, #8e5d00 100%)',

    color: '#080a0f',

    fontSize: '18px',

    fontWeight: 950,

    boxShadow: '0 8px 28px rgba(245,180,40,.18)',

  },

  logoText: {

    display: 'flex',

    flexDirection: 'column',

    lineHeight: 1,

    gap: '5px',

  },

  logoMain: {

    fontSize: '17px',

    fontWeight: 900,

    letterSpacing: '.16em',

  },

  logoSub: {

    fontSize: '9px',

    color: '#9ca3af',

    letterSpacing: '.22em',

    fontWeight: 700,

  },

  loginBtn: {

    display: 'inline-flex',

    alignItems: 'center',

    gap: '8px',

    color: '#d1d5db',

    textDecoration: 'none',

    fontSize: '13px',

    fontWeight: 700,

    padding: '10px 15px',

    borderRadius: '10px',

    border: '1px solid rgba(255,255,255,.10)',

    background: 'rgba(255,255,255,.03)',

  },

  shell: {

    maxWidth: '1180px',

    margin: '0 auto',

    padding: '48px 20px 70px',

    position: 'relative',

    zIndex: 2,

  },

  hero: {

    textAlign: 'center',

    maxWidth: '760px',

    margin: '0 auto 42px',

  },

  badge: {

    display: 'inline-flex',

    alignItems: 'center',

    gap: '8px',

    padding: '8px 13px',

    borderRadius: '999px',

    border: '1px solid rgba(245,180,40,.22)',

    background: 'rgba(245,180,40,.07)',

    color: '#f7c948',

    fontSize: '11px',

    fontWeight: 800,

    letterSpacing: '.12em',

    textTransform: 'uppercase',

    marginBottom: '18px',

  },

  heroTitle: {

    margin: 0,

    fontSize: 'clamp(34px, 5vw, 58px)',

    lineHeight: 1.03,

    fontWeight: 950,

    letterSpacing: '-.045em',

    background:

      'linear-gradient(180deg, #ffffff 15%, #f6d27a 65%, #c9911d 100%)',

    WebkitBackgroundClip: 'text',

    WebkitTextFillColor: 'transparent',

  },

  heroText: {

    margin: '18px auto 0',

    maxWidth: '620px',

    color: '#8f98aa',

    fontSize: '15px',

    lineHeight: 1.75,

  },

  contentGrid: {

    display: 'grid',

    gridTemplateColumns: 'minmax(270px, .72fr) minmax(0, 1.55fr)',

    gap: '22px',

    alignItems: 'start',

  },

  sideCard: {

    border: '1px solid rgba(255,255,255,.08)',

    borderRadius: '24px',

    padding: '27px',

    background:

      'linear-gradient(145deg, rgba(18,22,34,.92), rgba(9,12,20,.92))',

    boxShadow: '0 25px 80px rgba(0,0,0,.28)',

    position: 'sticky',

    top: '98px',

  },

  sideTitle: {

    fontSize: '19px',

    fontWeight: 850,

    margin: '0 0 8px',

  },

  sideText: {

    color: '#8992a5',

    fontSize: '13px',

    lineHeight: 1.65,

    margin: '0 0 22px',

  },

  benefit: {

    display: 'flex',

    gap: '12px',

    alignItems: 'flex-start',

    padding: '13px 0',

    borderTop: '1px solid rgba(255,255,255,.06)',

  },

  benefitIcon: {

    width: '34px',

    height: '34px',

    flexShrink: 0,

    borderRadius: '10px',

    display: 'flex',

    alignItems: 'center',

    justifyContent: 'center',

    background: 'rgba(245,180,40,.09)',

    border: '1px solid rgba(245,180,40,.12)',

    color: '#f7c948',

  },

  benefitTitle: {

    fontSize: '13px',

    fontWeight: 800,

    margin: '1px 0 4px',

  },

  benefitText: {

    fontSize: '11px',

    color: '#737d90',

    lineHeight: 1.5,

    margin: 0,

  },

  formCard: {

    border: '1px solid rgba(255,255,255,.09)',

    borderRadius: '26px',

    background:

      'linear-gradient(145deg, rgba(15,19,30,.97), rgba(7,10,17,.98))',

    boxShadow: '0 30px 100px rgba(0,0,0,.38)',

    overflow: 'hidden',

  },

  formTop: {

    padding: '27px 30px 23px',

    borderBottom: '1px solid rgba(255,255,255,.07)',

    display: 'flex',

    justifyContent: 'space-between',

    alignItems: 'center',

    gap: '15px',

  },

  formTopTitle: {

    margin: 0,

    fontSize: '18px',

    fontWeight: 850,

  },

  formTopText: {

    margin: '5px 0 0',

    color: '#737d90',

    fontSize: '12px',

  },

  secure: {

    display: 'flex',

    alignItems: 'center',

    gap: '7px',

    color: '#8d96a7',

    fontSize: '11px',

    whiteSpace: 'nowrap',

  },

  formBody: {

    padding: '28px 30px 32px',

  },

  section: {

    marginBottom: '26px',

  },

  sectionHead: {

    display: 'flex',

    alignItems: 'center',

    gap: '10px',

    marginBottom: '16px',

  },

  sectionNumber: {

    width: '27px',

    height: '27px',

    borderRadius: '9px',

    display: 'flex',

    alignItems: 'center',

    justifyContent: 'center',

    background: 'rgba(245,180,40,.10)',

    color: '#f7c948',

    fontSize: '11px',

    fontWeight: 900,

  },

  sectionTitle: {

    fontSize: '13px',

    fontWeight: 850,

    color: '#f0f2f6',

  },

  grid2: {

    display: 'grid',

    gridTemplateColumns: 'repeat(2, minmax(0,1fr))',

    gap: '15px',

  },

  inputGroup: {

    display: 'flex',

    flexDirection: 'column',

    gap: '7px',

  },

  label: {

    color: '#b8bfcc',

    fontSize: '11px',

    fontWeight: 750,

    letterSpacing: '.02em',

  },

  required: {

    color: '#f5b428',

  },

  inputWrap: {

    position: 'relative',

  },

  inputIcon: {

    position: 'absolute',

    left: '13px',

    top: '50%',

    transform: 'translateY(-50%)',

    color: '#646e81',

    pointerEvents: 'none',

    zIndex: 2,

  },

  input: {

    width: '100%',

    height: '48px',

    boxSizing: 'border-box',

    borderRadius: '12px',

    border: '1px solid rgba(255,255,255,.09)',

    outline: 'none',

    background: 'rgba(255,255,255,.035)',

    color: '#fff',

    padding: '0 14px 0 42px',

    fontSize: '13px',

    transition: 'all .2s ease',

  },

  select: {

    width: '100%',

    height: '48px',

    boxSizing: 'border-box',

    borderRadius: '12px',

    border: '1px solid rgba(255,255,255,.09)',

    outline: 'none',

    background: '#0b0f19',

    color: '#fff',

    colorScheme: 'dark',

    padding: '0 38px 0 42px',

    fontSize: '13px',

    appearance: 'none',

    cursor: 'pointer',

  },

  selectArrow: {

    position: 'absolute',

    right: '14px',

    top: '50%',

    transform: 'translateY(-50%)',

    color: '#667085',

    pointerEvents: 'none',

  },

  passwordButton: {

    position: 'absolute',

    right: '10px',

    top: '50%',

    transform: 'translateY(-50%)',

    width: '32px',

    height: '32px',

    display: 'flex',

    alignItems: 'center',

    justifyContent: 'center',

    border: 0,

    borderRadius: '8px',

    background: 'transparent',

    color: '#70798b',

    cursor: 'pointer',

  },

  alert: {

    display: 'flex',

    alignItems: 'center',

    gap: '10px',

    padding: '12px 14px',

    borderRadius: '12px',

    marginBottom: '20px',

    fontSize: '12px',

    lineHeight: 1.5,

  },

  error: {

    background: 'rgba(239,68,68,.08)',

    border: '1px solid rgba(239,68,68,.22)',

    color: '#ff8c8c',

  },

  success: {

    background: 'rgba(16,185,129,.08)',

    border: '1px solid rgba(16,185,129,.22)',

    color: '#66e0b3',

  },

  submit: {

    width: '100%',

    height: '54px',

    border: 0,

    borderRadius: '13px',

    background:

      'linear-gradient(135deg, #f8cc59 0%, #e7aa28 52%, #bd7d0b 100%)',

    color: '#0a0b0f',

    fontSize: '13px',

    fontWeight: 900,

    letterSpacing: '.02em',

    cursor: 'pointer',

    display: 'flex',

    alignItems: 'center',

    justifyContent: 'center',

    gap: '9px',

    boxShadow: '0 14px 35px rgba(221,157,27,.18)',

    transition: 'transform .2s ease, box-shadow .2s ease',

  },

  loginBottom: {

    textAlign: 'center',

    marginTop: '21px',

    paddingTop: '20px',

    borderTop: '1px solid rgba(255,255,255,.06)',

    color: '#70798b',

    fontSize: '12px',

  },

  loginLink: {

    color: '#f7c948',

    fontWeight: 800,

    textDecoration: 'none',

  },

  footer: {

    textAlign: 'center',

    marginTop: '28px',

    color: '#4f5869',

    fontSize: '10px',

    letterSpacing: '.05em',

  },

};

export default function ArtistRegisterPage() {

  const router = useRouter();

  const [formData, setFormData] = useState({

    name: '',

    email: '',

    mobile: '',

    dob: '',

    gender: '',

    city: '',

    state: '',

    role: '',

    password: '',

    confirmPassword: '',

  });

  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [errorMsg, setErrorMsg] = useState('');

  const [successMsg, setSuccessMsg] = useState('');

  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData((prev) => ({

      ...prev,

      [name]: value,

    }));

    if (errorMsg) setErrorMsg('');

  };

  const handleRegisterSubmit = async (e) => {

    e.preventDefault();

    setErrorMsg('');

    setSuccessMsg('');

    if (!formData.name.trim()) {

      setErrorMsg('Full Name is required.');

      return;

    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if (

      !formData.email.trim() ||

      !emailRegex.test(formData.email.trim())

    ) {

      setErrorMsg('Please enter a valid email address.');

      return;

    }

    const phoneClean = formData.mobile.replace(/[\s-]/g, '');

    if (!phoneClean || phoneClean.length < 10) {

      setErrorMsg(

        'Please enter a valid mobile number (at least 10 digits).'

      );

      return;

    }

    if (!formData.dob) {

      setErrorMsg('Date of Birth is required.');

      return;

    }

    if (!formData.gender) {

      setErrorMsg('Gender selection is required.');

      return;

    }

    if (!formData.city.trim()) {

      setErrorMsg('City is required.');

      return;

    }

    if (!formData.state.trim()) {

      setErrorMsg('State is required.');

      return;

    }

    if (!formData.role) {

      setErrorMsg('Please select your primary role.');

      return;

    }

    if (!formData.password || formData.password.length < 6) {

      setErrorMsg('Password must be at least 6 characters long.');

      return;

    }

    if (formData.password !== formData.confirmPassword) {

      setErrorMsg('Passwords do not match.');

      return;

    }

    try {

      setLoading(true);

      const payload = {

        name: formData.name.trim(),

        email: formData.email.trim(),

        mobile: formData.mobile.trim(),

        dob: formData.dob,

        gender: formData.gender,

        city: formData.city.trim(),

        state: formData.state.trim(),

        role: formData.role,

        password: formData.password,

      };

      const res = await fetch(`${BACKEND_URL}/api/artist/register`, {

        method: 'POST',

        headers: {

          'Content-Type': 'application/json',

        },

        credentials: 'include',

        body: JSON.stringify(payload),

      });

      const data = await res.json();

      if (res.ok && data.success) {

        setSuccessMsg('Artist account created successfully!');

        if (data.token && data.artist) {

          localStorage.setItem('mayad_artist_jwt', data.token);

          localStorage.setItem(

            'mayad_artist_portal_logged_email',

            data.artist.email

          );

        }

        setTimeout(() => {

          router.push('/artist/login');

        }, 1500);

      } else {

        setErrorMsg(

          data.message || 'Registration failed. Please try again.'

        );

      }

    } catch (err) {

      console.error('Artist Registration Error:', err);

      setErrorMsg(

        'Network error connecting to MAYAD backend server.'

      );

    } finally {

      setLoading(false);

    }

  };

  return (

    <div style={styles.page}>

      <div style={styles.glowOne} />

      <div style={styles.glowTwo} />

      <header style={styles.nav}>

        <div style={styles.navInner}>

          <Link href="/" style={styles.logo}>

            <div style={styles.logoBox}>M</div>

            <div style={styles.logoText}>

              <span style={styles.logoMain}>MAYAD</span>

              <span style={styles.logoSub}>ARTIST PORTAL</span>

            </div>

          </Link>

          <Link href="/artist/login" style={styles.loginBtn}>

            Already Registered

            <ArrowRight size={14} />

          </Link>

        </div>

      </header>

      <main style={styles.shell}>

        <section style={styles.hero}>

          <div style={styles.badge}>

            <Sparkles size={13} />

            Join the MAYAD Talent Network

          </div>

          <h1 style={styles.heroTitle}>

            Create Your Artist Profile

          </h1>

          <p style={styles.heroText}>

            Build your official MAYAD artist profile and connect with

            opportunities across film, production, acting, music and

            creative industries.

          </p>

        </section>

        <div style={styles.contentGrid}>

          <aside style={styles.sideCard}>

            <div

              style={{

                width: '48px',

                height: '48px',

                borderRadius: '14px',

                display: 'flex',

                alignItems: 'center',

                justifyContent: 'center',

                background:

                  'linear-gradient(135deg, rgba(245,180,40,.16), rgba(245,180,40,.04))',

                border: '1px solid rgba(245,180,40,.16)',

                color: '#f7c948',

                marginBottom: '18px',

              }}

            >

              <Film size={23} />

            </div>

            <h2 style={styles.sideTitle}>

              Your journey starts here.

            </h2>

            <p style={styles.sideText}>

              Register once and create a professional identity inside

              the MAYAD entertainment ecosystem.

            </p>

            <div style={styles.benefit}>

              <div style={styles.benefitIcon}>

                <Star size={16} />

              </div>

              <div>

                <h4 style={styles.benefitTitle}>

                  Professional Profile

                </h4>

                <p style={styles.benefitText}>

                  Showcase your role and professional information.

                </p>

              </div>

            </div>

            <div style={styles.benefit}>

              <div style={styles.benefitIcon}>

                <Briefcase size={16} />

              </div>

              <div>

                <h4 style={styles.benefitTitle}>

                  Entertainment Opportunities

                </h4>

                <p style={styles.benefitText}>

                  Discover opportunities across film and production.

                </p>

              </div>

            </div>

            <div style={styles.benefit}>

              <div style={styles.benefitIcon}>

                <ShieldCheck size={16} />

              </div>

              <div>

                <h4 style={styles.benefitTitle}>

                  Secure Account

                </h4>

                <p style={styles.benefitText}>

                  Your account credentials are protected.

                </p>

              </div>

            </div>

            <div

              style={{

                marginTop: '20px',

                padding: '13px 14px',

                borderRadius: '12px',

                background: 'rgba(255,255,255,.025)',

                border: '1px solid rgba(255,255,255,.06)',

                display: 'flex',

                gap: '9px',

                alignItems: 'flex-start',

              }}

            >

              <ShieldCheck

                size={15}

                color="#f7c948"

                style={{ marginTop: '1px', flexShrink: 0 }}

              />

              <span

                style={{

                  color: '#697386',

                  fontSize: '10px',

                  lineHeight: 1.55,

                }}

              >

                Please provide accurate information. Your profile

                information may be reviewed by the MAYAD team.

              </span>

            </div>

          </aside>

          <section style={styles.formCard}>

            <div style={styles.formTop}>

              <div>

                <h2 style={styles.formTopTitle}>

                  Artist Registration

                </h2>

                <p style={styles.formTopText}>

                  Complete your basic professional details.

                </p>

              </div>

              <div style={styles.secure}>

                <ShieldCheck size={14} color="#f7c948" />

                Secure Registration

              </div>

            </div>

            <div style={styles.formBody}>

              {errorMsg && (

                <div

                  style={{

                    ...styles.alert,

                    ...styles.error,

                  }}

                >

                  <AlertCircle size={16} />

                  <span>{errorMsg}</span>

                </div>

              )}

              {successMsg && (

                <div

                  style={{

                    ...styles.alert,

                    ...styles.success,

                  }}

                >

                  <CheckCircle size={16} />

                  <span>{successMsg}</span>

                </div>

              )}

              <form onSubmit={handleRegisterSubmit}>

                <div style={styles.section}>

                  <div style={styles.sectionHead}>

                    <div style={styles.sectionNumber}>01</div>

                    <span style={styles.sectionTitle}>

                      Personal Information

                    </span>

                  </div>

                  <div style={{ ...styles.grid2, marginBottom: '15px' }}>

                    <div style={styles.inputGroup}>

                      <label style={styles.label}>

                        Full Name{' '}

                        <span style={styles.required}></span>

                      </label>

                      <div style={styles.inputWrap}>

                        <User

                          size={17}

                          style={styles.inputIcon}

                        />

                        <input

                          type="text"

                          name="name"

                          value={formData.name}

                          onChange={handleChange}

                          placeholder="Rahul Sharma"

                          style={styles.input}

                          required

                        />

                      </div>

                    </div>

                    <div style={styles.inputGroup}>

                      <label style={styles.label}>

                        Email Address{' '}

                        <span style={styles.required}></span>

                      </label>

                      <div style={styles.inputWrap}>

                        <Mail

                          size={17}

                          style={styles.inputIcon}

                        />

                        <input

                          type="email"

                          name="email"

                          value={formData.email}

                          onChange={handleChange}

                          placeholder="artist\@example.com"

                          style={styles.input}

                          required

                        />

                      </div>

                    </div>

                  </div>

                  <div style={{ ...styles.grid2, marginBottom: '15px' }}>

                    <div style={styles.inputGroup}>

                      <label style={styles.label}>

                        Mobile Number{' '}

                        <span style={styles.required}></span>

                      </label>

                      <div style={styles.inputWrap}>

                        <Phone

                          size={17}

                          style={styles.inputIcon}

                        />

                        <input

                          type="tel"

                          name="mobile"

                          value={formData.mobile}

                          onChange={handleChange}

                          placeholder="+91 98765 43210"

                          style={styles.input}

                          required

                        />

                      </div>

                    </div>

                    <div style={styles.inputGroup}>

                      <label style={styles.label}>

                        Date of Birth{' '}

                        <span style={styles.required}>
                          
                        
                        </span>

                      </label>

                      <div style={styles.inputWrap}>

                        <Calendar

                          size={17}

                          style={styles.inputIcon}

                        />

                        <input

                          type="date"

                          name="dob"

                          value={formData.dob}

                          onChange={handleChange}

                          style={{

                            ...styles.input,

                            colorScheme: 'dark',

                          }}

                          required

                        />

                      </div>

                    </div>

                  </div>

                  <div style={styles.inputGroup}>

                    <label style={styles.label}>

                      Gender <span style={styles.required}>

                      </span>

                    </label>

                    <div style={styles.inputWrap}>

                      <User

                        size={17}

                        style={styles.inputIcon}

                      />

                      <select

                        name="gender"

                        value={formData.gender}

                        onChange={handleChange}

                        style={styles.select}

                        required

                      >

                        <option value="">Select Gender</option>

                        <option value="Male">Male</option>

                        <option value="Female">Female</option>

                        <option value="Non-Binary">

                          Non-Binary

                        </option>

                        <option value="Prefer Not to Say">

                          Prefer Not to Say

                        </option>

                      </select>

                      <ChevronDown

                        size={16}

                        style={styles.selectArrow}

                      />

                    </div>

                  </div>

                </div>

                <div style={styles.section}>

                  <div style={styles.sectionHead}>

                    <div style={styles.sectionNumber}>02</div>

                    <span style={styles.sectionTitle}>

                      Location

                    </span>

                  </div>

                  <div style={styles.grid2}>

                    <div style={styles.inputGroup}>

                      <label style={styles.label}>

                        City <span style={styles.required}></span>

                      </label>

                      <div style={styles.inputWrap}>

                        <MapPin

                          size={17}

                          style={styles.inputIcon}

                        />

                        <input

                          type="text"

                          name="city"

                          value={formData.city}

                          onChange={handleChange}

                          placeholder="Mumbai / Jaipur"

                          style={styles.input}

                          required

                        />

                      </div>

                    </div>

                    <div style={styles.inputGroup}>

                      <label style={styles.label}>

                        State <span style={styles.required}></span>

                      </label>

                      <div style={styles.inputWrap}>

                        <MapPin

                          size={17}

                          style={styles.inputIcon}

                        />

                        <input

                          type="text"

                          name="state"

                          value={formData.state}

                          onChange={handleChange}

                          placeholder="Rajasthan / Maharashtra"

                          style={styles.input}

                          required

                        />

                      </div>

                    </div>

                  </div>

                </div>

                <div style={styles.section}>

                  <div style={styles.sectionHead}>

                    <div style={styles.sectionNumber}>03</div>

                    <span style={styles.sectionTitle}>

                      Professional Information

                    </span>

                  </div>

                  <div style={styles.inputGroup}>

                    <label style={styles.label}>

                      Primary Role / Designation{' '}

                      <span style={styles.required}></span>

                    </label>

                    <div style={styles.inputWrap}>

                      <Briefcase

                        size={17}

                        style={styles.inputIcon}

                      />

                      <select

                        name="role"

                        value={formData.role}

                        onChange={handleChange}

                        style={styles.select}

                        required

                      >

                        <option value="">

                          Select Role / Position

                        </option>

                        {ROLE_CATEGORIES.map((catGroup) => (

                          <optgroup

                            key={catGroup.category}

                            label={catGroup.category}

                          >

                            {catGroup.roles.map((role) => (

                              <option

                                key={role}

                                value={role}

                              >

                                {role}

                              </option>

                            ))}

                          </optgroup>

                        ))}

                      </select>

                      <ChevronDown

                        size={16}

                        style={styles.selectArrow}

                      />

                    </div>

                  </div>

                </div>

                <div style={styles.section}>

                  <div style={styles.sectionHead}>

                    <div style={styles.sectionNumber}>04</div>

                    <span style={styles.sectionTitle}>

                      Account Security

                    </span>

                  </div>

                  <div style={styles.grid2}>

                    <div style={styles.inputGroup}>

                      <label style={styles.label}>

                        Password{' '}

                        <span style={styles.required}></span>

                      </label>

                      <div style={styles.inputWrap}>

                        <Lock

                          size={17}

                          style={styles.inputIcon}

                        />

                        <input

                          type={

                            showPassword ? 'text' : 'password'

                          }

                          name="password"

                          value={formData.password}

                          onChange={handleChange}

                          placeholder="Minimum 6 characters"

                          style={{

                            ...styles.input,

                            paddingRight: '48px',

                          }}

                          required

                        />

                        <button

                          type="button"

                          onClick={() =>

                            setShowPassword(!showPassword)

                          }

                          style={styles.passwordButton}

                          aria-label="Toggle password visibility"

                        >

                          {showPassword ? (

                            <EyeOff size={17} />

                          ) : (

                            <Eye size={17} />

                          )}

                        </button>

                      </div>

                    </div>

                    <div style={styles.inputGroup}>

                      <label style={styles.label}>

                        Confirm Password{' '}

                        <span style={styles.required}></span>

                      </label>

                      <div style={styles.inputWrap}>

                        <Lock

                          size={17}

                          style={styles.inputIcon}

                        />

                        <input

                          type={

                            showConfirmPassword

                              ? 'text'

                              : 'password'

                          }

                          name="confirmPassword"

                          value={formData.confirmPassword}

                          onChange={handleChange}

                          placeholder="Re-enter password"

                          style={{

                            ...styles.input,

                            paddingRight: '48px',

                          }}

                          required

                        />

                        <button

                          type="button"

                          onClick={() =>

                            setShowConfirmPassword(

                              !showConfirmPassword

                            )

                          }

                          style={styles.passwordButton}

                          aria-label="Toggle confirm password visibility"

                        >

                          {showConfirmPassword ? (

                            <EyeOff size={17} />

                          ) : (

                            <Eye size={17} />

                          )}

                        </button>

                      </div>

                    </div>

                  </div>

                </div>

                <button

                  type="submit"

                  disabled={loading}

                  style={{

                    ...styles.submit,

                    opacity: loading ? 0.7 : 1,

                    cursor: loading

                      ? 'not-allowed'

                      : 'pointer',

                  }}

                >

                  {loading ? (

                    <>

                      <RefreshCw

                        size={18}

                        style={{

                          animation: 'spin 1s linear infinite',

                        }}

                      />

                      Creating Account...

                    </>

                  ) : (

                    <>

                      Create Artist Account

                      <ArrowRight size={18} />

                    </>

                  )}

                </button>

              </form>

              <div style={styles.loginBottom}>

                Already have a MAYAD artist account?{' '}

                <Link

                  href="/artist/login"

                  style={styles.loginLink}

                >

                  Sign In

                </Link>

              </div>

            </div>

          </section>

        </div>

        <div style={styles.footer}>

          © {new Date().getFullYear()} MAYAD • ARTIST NETWORK

        </div>

      </main>

      <style jsx global>{`

         {

          box-sizing: border-box;

        }

        body {

          margin: 0;

          background: #05070d;

        }

        input::placeholder {

          color: #4f5869;

        }

        input:focus,

        select:focus {

          border-color: rgba(245, 180, 40, 0.55) !important;

          background: rgba(245, 180, 40, 0.035) !important;

          box-shadow:

            0 0 0 3px rgba(245, 180, 40, 0.07),

            0 8px 25px rgba(0, 0, 0, 0.12);

        }

        /* =====================================================

           DARK SELECT DROPDOWN

           Keeps native browser dropdown readable in dark theme

        ===================================================== */

        select,

        select:active,

        select:focus {

          color-scheme: dark;

        }

        select option,

        select optgroup {

          background: #0b0f19 !important;

          color: #ffffff !important;

        }

        select option:checked {

          background: #f5b428 !important;

          color: #0a0b0f !important;

        }

        select option:hover {

          background: #1b2333 !important;

          color: #ffffff !important;

        }

        button:hover:not(:disabled) {

          filter: brightness(1.05);

        }

        @keyframes spin {

          from {

            transform: rotate(0deg);

          }

          to {

            transform: rotate(360deg);

          }

        }

        @media (max-width: 900px) {

          .artist-register-grid {

            grid-template-columns: 1fr !important;

          }

        }

        @media (max-width: 700px) {

          header {

            height: 68px !important;

          }

          main {

            padding-left: 14px !important;

            padding-right: 14px !important;

            padding-top: 32px !important;

          }

          form {

            width: 100%;

          }

        }

        @media (max-width: 600px) {

          .artist-grid-2 {

            grid-template-columns: 1fr !important;

          }

        }

      `}</style>

    </div>

  );

}
