'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
    ArrowUpRight,
    Instagram,
    Facebook,
    Youtube,
    Music2,
    Film,
    PenLine,
    Mic2,
    Clapperboard,
    Crown,
    Globe,
    Smartphone,
    PlayCircle,
    Linkedin,
    Pause,
    Play,
} from 'lucide-react';

function XIcon({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className={className}
            aria-hidden="true"
        >
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.657l-5.214-6.817-5.967 6.817H1.681l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
        </svg>
    );
}

const DIRECTING_CREDITS = [
    'Maa Hadi Rani',
    'Maa Padmavati',
    'Sanwariya Seth',
    'Sanwariya Seth 2',
    'Vadlya Hindva',
];

const WRITING_CREDITS = [
    'Maa Hadi Rani',
    'Maa Padmavati',
    'Sanwariya Seth',
    'Sanwariya Seth 2',
    'Vadlya Hindva',
];

const ACTING_CREDITS = ['Sanwariya Seth', 'Vadlya Hindva'];

const MUSIC_CREDITS = [
    'Kishmat',
    'Apna Marwadi Song',
    'Durgadas Song',
    'Harawal',
    'Harawal 2',
    'Sanwariya Seth',
    'Ladlo',
    'Seth Mara Sanwariya',
    'Leela Thari Nirali',
    'Sethji Mara Jiv',
    'Bhakt Nirala',
    'Kan Kan Mein',
    'Aayo Jag Me',
    'Gopal Ghar Aayo',
    'Khichadi',
    'Dada Chhod Gaya',
    'English Rap',
    'Jai Shree Ram',
    'Marwadi',
    'Durgadas Rathore',
    'Mahakumbh',
    'Veer Kunpaji',
    'Veeramdev Chouhan',
    'Vishvamitra',
    'Adhikar',
    'Harawal Diwair Ka Yudh (Version 2)',
];

const MUSIC_TRACKS = [
    {
        title: "Kishmat",
        src: "/music/kishmat.mp3",
        spotifyUrl: "https://open.spotify.com/album/70QhS0GCcyj4iRSFXVVMOL",
        appleMusicUrl: "https://music.apple.com/in/album/kishmat-single/1787912269",
    },
    {
        title: "Apna Marwadi Song",
        src: "/music/apna-marwadi-song.mp3",
        spotifyUrl: "https://open.spotify.com/album/3nMF2Fv6ALzaqhp8FmYqzZ?si=jTbfpVg_SK-dUK0dzgjaKw&utm_source=whatsapp&nd=1&dlsi=76b857a2a81d4128",
        appleMusicUrl: "https://music.apple.com/in/album/marwadi-single/1786121483",
    },
    {
        title: "Durgadas Song",
        src: "/music/durgadas-song.mp3",
        spotifyUrl: "https://open.spotify.com/track/1N8gdlwusHqc0hdRXh7Ql0?autoplay_ok=1",
        appleMusicUrl: "https://music.apple.com/in/album/durgadas-rathore/1791262859?i=1791262860",
    },
    {
        title: "Harawal",
        src: "/music/harawal.mp3",
        spotifyUrl: "https://open.spotify.com/track/2xCKcHZXpz7RxraUqrKdkg?autoplay_ok=1",
        appleMusicUrl: "https://music.apple.com/in/album/harawal-single/1789387399",
    },
    {
        title: "Harawal 2",
        src: "/music/harawal-2.mp3",
        spotifyUrl: "https://open.spotify.com/track/6NJglxCJjtjWcRNCiCvqh9?autoplay_ok=1",
        appleMusicUrl: "https://music.apple.com/in/album/harawal-diwair-ka-yudh-version-2-single/1797284643",
    },
    {
        title: "Sanwariya Seth",
        src: "/music/sanwariya-seth.mp3",
        spotifyUrl: "https://open.spotify.com/track/0PEdS1RcBLDbtFxRGohfoo?autoplay_ok=1",
        appleMusicUrl: "https://music.apple.com/in/album/sanwariya-seth-ep/1844092121",
    },
    {
        title: "Ladlo",
        src: "/music/ladlo.mp3",
        spotifyUrl: "https://open.spotify.com/track/3P2ZOX6MbKJvKaVw5k2Doz?autoplay_ok=1",
        appleMusicUrl: "https://music.apple.com/in/album/ladlo-from-sanwariya-seth-single/1881628655",
    },
    {
        title: "Seth Mara Sanwariya",
        src: "/music/seth-mara-sanwariya.mp3",
        spotifyUrl: "https://open.spotify.com/track/0PEdS1RcBLDbtFxRGohfoo?autoplay_ok=1",
        appleMusicUrl: "https://music.apple.com/in/album/sanwariya-seth-ep/1844092121",
    },
    {
        title: "Leela Thari Nirali",
        src: "/music/leela-thari-nirali.mp3",
        spotifyUrl: "https://open.spotify.com/track/6qH2xHfZWSxQuS9Z0y5PYw",
        appleMusicUrl: "https://music.apple.com/in/album/lila-thari-sanwariya-from-sanwariya-seth-single/1881628570",
    },
    {
        title: "Sethji Mara Jiv",
        src: "/music/sethji-mara-jiv.mp3",
        spotifyUrl: "https://open.spotify.com/track/6OwFHSpveytCtTKhTYVINJ?autoplay_ok=1",
        appleMusicUrl: "https://music.apple.com/in/album/sethji-mara-jiv-single/1877692579",
    },
    {
        title: "Bhakt Nirala",
        src: "/music/bhakt-nirala.mp3",
        spotifyUrl: "https://open.spotify.com/track/1YYKshujkU2bzUcjRCEIsP?autoplay_ok=1",
        appleMusicUrl: "https://music.apple.com/in/album/bhakt-nirala-from-sanwariya-seth-single/1881628768",
    },
    {
        title: "Kan Kan Mein",
        src: "/music/kan-kan-mein.mp3",
        spotifyUrl: "https://open.spotify.com/track/1zISVgJ9MfjXwZymJP6mED?autoplay_ok=1",
        appleMusicUrl: "https://music.apple.com/in/album/kan-kan-mein-from-sanwariya-seth-single/1881628568",
    },
    {
        title: "Aayo Jag Me",
        src: "/music/aayo-jag-me.mp3",
        spotifyUrl: "https://open.spotify.com/track/2C5j7vdTLzBUw9yjmq70WX?autoplay_ok=1",
        appleMusicUrl: "https://music.apple.com/in/album/aayo-jag-me/1844092121?i=1844092124",
    },
    {
        title: "Gopal Ghar Aayo",
        src: "/music/gopal-ghar-aayo.mp3",
        spotifyUrl: "https://open.spotify.com/track/7EWNxMr6B17q3NWTDoNwsm?autoplay_ok=1",
        appleMusicUrl: "https://music.apple.com/in/album/gopal-ghar-aayo/1844092121?i=1844092130",
    },
    {
        title: "Khichadi",
        src: "/music/khichadi.mp3",
        spotifyUrl: "https://open.spotify.com/search/DP%20Singh%20Basni%20Khichadi",
        appleMusicUrl: "https://music.apple.com/in/search?term=DP%20Singh%20Basni%20Khichadi",
    },
    {
        title: "Dada Chhod Gaya",
        src: "/music/dada-chhod-gaya.mp3",
        spotifyUrl: "https://open.spotify.com/search/DP%20Singh%20Basni%20Dada%20Chhod%20Gaya",
        appleMusicUrl: "https://music.apple.com/in/search?term=DP%20Singh%20Basni%20Dada%20Chhod%20Gaya",
    },
    {
        title: "English Rap",
        src: "/music/english-rap.mp3",
        spotifyUrl: "https://open.spotify.com/search/DP%20Singh%20Basni%20English%20Rap",
        appleMusicUrl: "https://music.apple.com/in/search?term=DP%20Singh%20Basni%20English%20Rap",
    },
    {
        title: "Jai Shree Ram",
        src: "/music/jai-shree-ram.mp3",
        spotifyUrl: "https://open.spotify.com/search/DP%20Singh%20Basni%20Jai%20Shree%20Ram",
        appleMusicUrl: "https://music.apple.com/in/search?term=DP%20Singh%20Basni%20Jai%20Shree%20Ram",
    },
    {
        title: "Mahakumbh",
        src: "/music/mahakumbh.mp3",
        spotifyUrl: "https://open.spotify.com/search/DP%20Singh%20Basni%20Mahakumbh",
        appleMusicUrl: "https://music.apple.com/gb/album/mahakumbh-single/1791263384",
    },
    {
        title: "Veer Kunpaji",
        src: "/music/veer-kunpaji.mp3",
        spotifyUrl: "https://open.spotify.com/search/DP%20Singh%20Basni%20Veer%20Kunpaji",
        appleMusicUrl: "https://music.apple.com/gb/album/veer-kunpaji-single/1793073937",
    },
    {
        title: "Veeramdev Chouhan",
        src: "/music/veeramdev-chouhan.mp3",
        spotifyUrl: "https://open.spotify.com/search/DP%20Singh%20Basni%20Veeramdev%20Chouhan",
        appleMusicUrl: "https://music.apple.com/gb/album/veeramdev-chouhan-single/1789387254",
    },
    {
        title: "Vishvamitra",
        src: "/music/vishvamitra.mp3",
        spotifyUrl: "https://open.spotify.com/search/DP%20Singh%20Basni%20Vishvamitra",
        appleMusicUrl: "https://music.apple.com/in/search?term=DP%20Singh%20Basni%20Vishvamitra",
    },
    {
        title: "Adhikar",
        src: "/music/adhikar.mp3",
        spotifyUrl: "https://open.spotify.com/search/DP%20Singh%20Basni%20Adhikar",
        appleMusicUrl: "https://music.apple.com/in/search?term=DP%20Singh%20Basni%20Adhikar",
    },
];

const ROLES = [
    { label: 'Filmmaker', icon: Clapperboard },
    { label: 'Director', icon: Film },
    { label: 'Writer', icon: PenLine },
    { label: 'Actor', icon: PlayCircle },
    { label: 'Singer', icon: Mic2 },
    { label: 'Producer', icon: Film },
    { label: 'Founder & CEO', icon: Crown },
];

const SOCIAL_LINKS = [
    {
        label: 'Instagram',
        href: 'https://www.instagram.com/director_dpsingh?stkn=MTFnN2YxbnB1bjhoeQ%3D%3D&utm_source=qr',
        icon: Instagram,
    },
    {
        label: 'Facebook',
        href: 'https://www.facebook.com/share/19XGY37C9f/?mibextid=wwXIfr',
        icon: Facebook,
    },
    {
        label: 'X (Twitter)',
        href: 'https://x.com/dpsinghbasni?s=11',
        icon: XIcon,
    },
    {
        label: 'LinkedIn',
        href: 'https://www.linkedin.com/in/devendra-pratap-singh-rathore-b28412328?utm_source=share_via&utm_content=profile&utm_medium=member_ios',
        icon: Linkedin,
    },
];

const SectionHeading = ({
    eyebrow,
    title,
    description,
}: {
    eyebrow: string;
    title: string;
    description?: string;
}) => (
    <div className="mb-10 max-w-3xl">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.28em] text-mayad-gold">
            {eyebrow}
        </p>
        <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
            {title}
        </h2>
        {description && (
            <p className="mt-4 text-sm leading-7 text-slate-400 sm:text-base">
                {description}
            </p>
        )}
    </div>
);

const CreditCard = ({
    title,
    items,
    icon: Icon,
}: {
    title: string;
    items: string[];
    icon: React.ElementType;
}) => (
    <div className="group rounded-2xl border border-white/10 bg-white/[0.035] p-5 transition-all duration-300 hover:border-mayad-gold/40 hover:bg-white/[0.055]">
        <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-mayad-gold/10 text-mayad-gold">
                <Icon className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-white">{title}</h3>
        </div>

        <div className="space-y-2.5">
            {items.map((item) => (
                <div
                    key={item}
                    className="flex items-start gap-3 rounded-xl border border-white/5 bg-black/20 px-3.5 py-3"
                >
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-mayad-gold" />
                    <span className="text-sm leading-6 text-slate-300">{item}</span>
                </div>
            ))}
        </div>
    </div>
);

const MUSIC_POSTERS = [
    "/music/kishmat.jpg",
    "/music/marwadi.jpg",
    "/music/durgadas.jpg",
    "/music/Harawal.jpg",
    "/music/harawal2.jpg",
    "/music/sanwariyaseth.jpg",
    "/music/ladlo.jpg",
    "/music/sanwariyaseth.jpg",
    "/music/lila.jpg",
    "/music/sethjimarajiv.jpg",
    "/music/bhaktnirala.jpg",
    "/music/sanwariyaseth.jpg",
    "/music/sanwariyaseth.jpg",
    "/music/sanwariyaseth.jpg",
    "/music/sanwariyaseth.jpg",
     "/music/sanwariyaseth.jpg",
     "/music/englishrap.jpg",
     "/music/jaishreeram.jpg",
     "/music/mahakumbh.jpg",
     "/music/veerkunpaji.jpg",
     "/music/veerramdev.jpg",
     "/music/vishvamitra.jpg",
     "/music/adhikar.jpg",

];

function MusicPlayer() {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [activeTrack, setActiveTrack] = useState<string | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const currentTrack = MUSIC_TRACKS.find(
        (track) => track.title === activeTrack
    );

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const handleEnded = () => {
            setIsPlaying(false);
        };

        const handleError = () => {
            setIsPlaying(false);
            setErrorMessage(
                "Audio file could not be played. Please check the song file."
            );
        };

        audio.addEventListener("ended", handleEnded);
        audio.addEventListener("error", handleError);

        return () => {
            audio.removeEventListener("ended", handleEnded);
            audio.removeEventListener("error", handleError);
        };
    }, []);

    const playTrack = async (track: (typeof MUSIC_TRACKS)[number]) => {
        const audio = audioRef.current;
        if (!audio) return;

        setErrorMessage("");

        try {
            if (activeTrack === track.title && !audio.paused) {
                audio.pause();
                setIsPlaying(false);
                return;
            }

            if (activeTrack !== track.title) {
                audio.pause();
                audio.src = track.src;
                audio.load();
                setActiveTrack(track.title);
            }

            await audio.play();
            setIsPlaying(true);
        } catch (error) {
            console.error(`Unable to play "${track.title}"`, error);
            setIsPlaying(false);
            setErrorMessage(
                "This song could not be played. Please check the song file."
            );
        }
    };

    return (
        <>
            <audio ref={audioRef} preload="metadata" className="hidden" />

            {/* MUSIC LIBRARY */}
            <div className="mb-7 flex items-end justify-between gap-4">
                <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-mayad-gold">
                        Music Library
                    </p>
                    <h3 className="mt-1 text-2xl font-black text-white sm:text-3xl">
                        DP Singh Basni
                    </h3>
                </div>

                <p className="hidden text-xs font-medium text-slate-500 sm:block">
                    {MUSIC_TRACKS.length} tracks
                </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {MUSIC_TRACKS.map((track, index) => {
                    const selected = activeTrack === track.title;
                    const poster =
                        MUSIC_POSTERS[index % MUSIC_POSTERS.length];

                    return (
                        <article
                            key={`${track.title}-${index}`}
                            className={`group overflow-hidden rounded-2xl border transition-all duration-300 ${selected
                                    ? "border-mayad-gold/50 bg-mayad-gold/[0.07] shadow-[0_14px_40px_rgba(212,175,55,0.09)]"
                                    : "border-white/[0.08] bg-white/[0.025] hover:-translate-y-1 hover:border-white/15 hover:bg-white/[0.04]"
                                }`}
                        >
                            <div className="flex gap-3.5 p-3.5">
                                {/* MUSIC POSTER */}
                                <button
                                    type="button"
                                    onClick={() => playTrack(track)}
                                    className="group/poster relative h-[82px] w-[82px] shrink-0 overflow-hidden rounded-xl border border-white/10 bg-black"
                                    aria-label={`${selected && isPlaying
                                            ? "Pause"
                                            : "Play"
                                        } ${track.title}`}
                                >
                                    <Image
                                        src={poster}
                                        alt={`${track.title} music poster`}
                                        fill
                                        sizes="82px"
                                        className="object-cover transition-transform duration-500 group-hover/poster:scale-110"
                                    />

                                    <div className="absolute inset-0 bg-black/25 transition-colors duration-300 group-hover/poster:bg-black/40" />

                                    <span
                                        className={`absolute inset-0 m-auto flex h-9 w-9 items-center justify-center rounded-full shadow-lg transition-all ${selected && isPlaying
                                                ? "bg-mayad-gold text-black"
                                                : "bg-black/70 text-mayad-gold backdrop-blur-sm group-hover/poster:bg-mayad-gold group-hover/poster:text-black"
                                            }`}
                                    >
                                        {selected && isPlaying ? (
                                            <Pause className="h-4 w-4" />
                                        ) : (
                                            <Play className="ml-0.5 h-4 w-4 fill-current" />
                                        )}
                                    </span>
                                </button>

                                <div className="min-w-0 flex-1 py-0.5">
                                    <div className="flex items-start justify-between gap-2">
                                        <span className="text-[9px] font-bold text-slate-600">
                                            {String(index + 1).padStart(2, "0")}
                                        </span>

                                        {selected && isPlaying && (
                                            <div className="flex items-end gap-0.5">
                                                <span className="h-2 w-0.5 animate-pulse rounded-full bg-mayad-gold" />
                                                <span className="h-4 w-0.5 animate-pulse rounded-full bg-mayad-gold [animation-delay:120ms]" />
                                                <span className="h-3 w-0.5 animate-pulse rounded-full bg-mayad-gold [animation-delay:240ms]" />
                                            </div>
                                        )}
                                    </div>

                                    <h4
                                        className={`mt-1 truncate text-sm font-bold ${selected
                                                ? "text-mayad-gold"
                                                : "text-slate-100 group-hover:text-white"
                                            }`}
                                        title={track.title}
                                    >
                                        {track.title}
                                    </h4>

                                    <p className="mt-1 text-[10px] text-slate-500">
                                        DP Singh Basni
                                    </p>

                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {/* Spotify */}
                                        <a
                                            href={track.spotifyUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            onClick={(event) => event.stopPropagation()}
                                            className="inline-flex items-center gap-1.5 rounded-xl border border-[#1DB954]/20 bg-[#1DB954]/[0.06] px-3.5 py-2 text-[11px] font-bold text-slate-300 transition-all duration-200 hover:border-[#1DB954]/45 hover:bg-[#1DB954]/12 hover:text-white"
                                        >
                                            <span className="text-sm leading-none text-[#1DB954]">
                                                ●
                                            </span>
                                            Spotify
                                        </a>

                                        {/* Apple Music */}
                                        <a
                                            href={track.appleMusicUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            onClick={(event) => event.stopPropagation()}
                                            className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2 text-[11px] font-bold text-slate-300 transition-all duration-200 hover:border-white/25 hover:bg-white/[0.08] hover:text-white"
                                        >
                                            <Music2 className="h-3.5 w-3.5 text-mayad-gold" />
                                            Apple Music
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </article>
                    );
                })}
            </div>

            {currentTrack && (
                <div className="mt-5 flex items-center justify-between gap-4 rounded-2xl border border-mayad-gold/15 bg-mayad-gold/[0.04] px-4 py-3.5">
                    <div className="flex min-w-0 items-center gap-3">
                        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-mayad-gold/20">
                            <Image
                                src={
                                    MUSIC_POSTERS[
                                    MUSIC_TRACKS.findIndex(
                                        (track) =>
                                            track.title ===
                                            currentTrack.title
                                    ) % MUSIC_POSTERS.length
                                    ]
                                }
                                alt=""
                                fill
                                sizes="40px"
                                className="object-cover"
                            />
                        </div>

                        <div className="min-w-0">
                            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-mayad-gold">
                                Now Playing
                            </p>
                            <p className="mt-0.5 truncate text-sm font-semibold text-white">
                                {currentTrack.title}
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => playTrack(currentTrack)}
                        className="shrink-0 rounded-full border border-mayad-gold/30 bg-mayad-gold/10 px-4 py-2 text-xs font-bold text-mayad-gold transition hover:bg-mayad-gold hover:text-black"
                    >
                        {isPlaying ? "Pause" : "Play"}
                    </button>
                </div>
            )}

            {errorMessage && (
                <p className="mt-4 rounded-xl border border-red-500/20 bg-red-500/5 px-3 py-2 text-xs text-red-300">
                    {errorMessage}
                </p>
            )}
        </>
    );
}

export default function FounderPage() {
    return (
        <main className="min-h-screen overflow-hidden bg-mayad-bg text-white">
            {/* =========================================================
          HERO
      ========================================================= */}
            <section className="relative min-h-[78vh] overflow-hidden pt-28 sm:pt-32">
                <div className="absolute inset-0">
                    <Image
                        src="/ceo.jpg"
                        alt="DP Singh Basni"
                        fill
                        priority
                        sizes="100vw"
                        className="object-cover object-center opacity-35"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-black/45" />
                    <div className="absolute inset-0 bg-gradient-to-t from-mayad-bg via-transparent to-black/30" />
                </div>

                <div className="absolute -left-40 top-20 h-80 w-80 rounded-full bg-mayad-gold/10 blur-[120px]" />
                <div className="absolute right-0 top-1/3 h-96 w-96 rounded-full bg-amber-500/5 blur-[130px]" />

                <div className="relative mx-auto grid min-h-[62vh] w-full max-w-7xl items-center gap-12 px-5 pb-20 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:px-10">
                    <div>
                        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-mayad-gold/30 bg-mayad-gold/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-mayad-gold">
                            <Crown className="h-4 w-4" />
                            Founder & CEO · MAYAD
                        </div>

                        <h1 className="max-w-4xl text-5xl font-black leading-[0.95] tracking-tight sm:text-6xl lg:text-8xl">
                            DP Singh
                            <span className="block text-mayad-gold">Basni</span>
                        </h1>

                        <p className="mt-6 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
                            Rajasthani filmmaker, director, writer, actor and singer building
                            a dedicated digital space for Rajasthan&apos;s cinema, language,
                            culture and stories.
                        </p>

                        <div className="mt-8 flex flex-wrap gap-2.5">
                            {ROLES.map(({ label, icon: Icon }) => (
                                <span
                                    key={label}
                                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-2 text-xs font-semibold text-slate-200 backdrop-blur-md"
                                >
                                    <Icon className="h-3.5 w-3.5 text-mayad-gold" />
                                    {label}
                                </span>
                            ))}
                        </div>

                        <div className="mt-9 flex flex-wrap gap-3">
                            <Link
                                href="#credits"
                                className="inline-flex items-center gap-2 rounded-full bg-mayad-gold px-5 py-3 text-sm font-bold text-black shadow-glow-gold transition hover:brightness-110"
                            >
                                Explore Credits
                                <ArrowUpRight className="h-4 w-4" />
                            </Link>
                        </div>
                    </div>

                    <div className="mx-auto w-full max-w-md lg:ml-auto">
                        <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-black/40 p-2 shadow-2xl backdrop-blur-xl">
                            <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem]">
                                <Image
                                    src="/ceo.jpg"
                                    alt="DP Singh Basni - Founder & CEO of MAYAD"
                                    fill
                                    sizes="(max-width: 1024px) 90vw, 420px"
                                    className="object-cover"
                                />
                                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black via-black/35 to-transparent" />
                                <div className="absolute bottom-6 left-6 right-6">
                                    <p className="text-xs font-bold uppercase tracking-[0.22em] text-mayad-gold">
                                        MAYAD Studios
                                    </p>
                                    <p className="mt-1 text-2xl font-black">DP Singh Basni</p>
                                    <p className="mt-1 text-sm text-slate-300">
                                        Founder & CEO
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* =========================================================
          PROFILE
      ========================================================= */}
            <section className="border-y border-white/5 bg-black/20 py-20">
                <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10">
                    <SectionHeading
                        eyebrow="Professional Profile"
                        title="A creative voice for Rajasthan"
                    />

                    <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
                        <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-6 sm:p-8">
                            <p className="text-base leading-8 text-slate-300">
                                DP Singh Basni is a Rajasthani filmmaker, director, writer,
                                actor and singer, and the Founder & CEO of MAYAD Studios /
                                MAYAD OTT.
                            </p>
                            <p className="mt-5 text-base leading-8 text-slate-300">
                                His work focuses on Rajasthan&apos;s language, culture, history,
                                heritage, folk traditions and regional storytelling. Through
                                cinema, music and digital media, his creative direction is
                                centered on giving Rajasthani stories and talent a dedicated
                                professional platform.
                            </p>
                            <p className="mt-5 text-base leading-8 text-slate-300">
                                As the founder of MAYAD, he is working toward a broader digital
                                entertainment ecosystem for Rajasthan — connecting films,
                                music, artists, emerging talent, cultural storytelling and
                                digital distribution.
                            </p>
                        </div>

                        <div className="rounded-3xl border border-mayad-gold/20 bg-gradient-to-br from-mayad-gold/10 to-transparent p-6 sm:p-8">
                            <p className="text-xs font-bold uppercase tracking-[0.2em] text-mayad-gold">
                                Professional Name
                            </p>
                            <h3 className="mt-3 text-3xl font-black">DP Singh Basni</h3>

                            <div className="mt-7 space-y-3">
                                {ROLES.map(({ label }) => (
                                    <div
                                        key={label}
                                        className="flex items-center justify-between border-b border-white/10 pb-3 text-sm"
                                    >
                                        <span className="text-slate-400">Role</span>
                                        <span className="font-semibold text-white">{label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* =========================================================
          CREDITS
      ========================================================= */}
            <section id="credits" className="scroll-mt-24 py-20">
                <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10">
                    <SectionHeading
                        eyebrow="Filmography"
                        title="Directing, writing & acting credits"
                        description="Selected professional credits associated with DP Singh Basni."
                    />

                    <div className="grid gap-5 lg:grid-cols-3">
                        <CreditCard
                            title="Director"
                            items={DIRECTING_CREDITS}
                            icon={Clapperboard}
                        />
                        <CreditCard
                            title="Writer"
                            items={WRITING_CREDITS}
                            icon={PenLine}
                        />
                        <CreditCard
                            title="Actor"
                            items={ACTING_CREDITS}
                            icon={PlayCircle}
                        />
                    </div>
                </div>
            </section>

            {/* =========================================================
          MUSIC
      ========================================================= */}
            <section className="border-y border-white/5 bg-white/[0.015] py-20">
                <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10">
                    <SectionHeading
                        eyebrow="Music"
                        title="Singer & music releases"
                        description="Music associated with DP Singh Basni, including releases and tracks supplied for the professional profile."
                    />

                    <MusicPlayer />

                </div>
            </section>

            {/* =========================================================
          MAYAD
      ========================================================= */}
            <section className="py-20">
                <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10">
                    <SectionHeading
                        eyebrow="MAYAD Studios / MAYAD OTT"
                        title="Building a digital ecosystem for Rajasthan"
                        description="A platform created around Rajasthani cinema, language, culture and emerging creative talent."
                    />

                    <div className="grid gap-5 lg:grid-cols-2">
                        <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-6 sm:p-8">
                            <h3 className="text-2xl font-black text-white">
                                Why MAYAD was created
                            </h3>

                            <p className="mt-5 text-sm leading-7 text-slate-400 sm:text-base">
                                Rajasthan has a rich history, language, culture, folk
                                traditions and storytelling heritage. MAYAD was created to
                                provide Rajasthani creators and stories with a dedicated
                                digital identity and professional space.
                            </p>

                            <ul className="mt-6 space-y-3">
                                {[
                                    'Give Rajasthani cinema its own digital identity',
                                    'Promote and preserve the Rajasthani language and culture',
                                    'Provide a platform for filmmakers and artists',
                                    'Discover and develop new actors, writers, directors and technicians',
                                    'Connect young audiences with Rajasthan’s language and culture',
                                    'Take Rajasthani stories and cinema to audiences across India and internationally',
                                    'Build a sustainable Rajasthani entertainment and film ecosystem',
                                ].map((item) => (
                                    <li key={item} className="flex gap-3 text-sm leading-6 text-slate-300">
                                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-mayad-gold" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="rounded-3xl border border-mayad-gold/20 bg-gradient-to-br from-mayad-gold/10 via-transparent to-transparent p-6 sm:p-8">
                            <h3 className="text-2xl font-black text-white">
                                Future vision
                            </h3>

                            <p className="mt-5 text-sm leading-7 text-slate-400 sm:text-base">
                                The long-term vision is to build a complete digital
                                entertainment ecosystem for Rajasthan.
                            </p>

                            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                                {[
                                    'Rajasthani feature films',
                                    'Short films',
                                    'Web series',
                                    'Original music',
                                    'Cultural & historical stories',
                                    'New talent discovery',
                                    'Acting workshops & auditions',
                                    'Film production',
                                    'Digital distribution',
                                    'Opportunities for emerging artists & technicians',
                                ].map((item) => (
                                    <div
                                        key={item}
                                        className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-slate-300"
                                    >
                                        {item}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* =========================================================
          REACH
      ========================================================= */}
            <section className="border-t border-white/5 bg-black/20 py-20">
                <div className="mx-auto w-full max-w-4xl px-5 sm:px-8 lg:px-10">
                    <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-6 sm:p-8">
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-mayad-gold">
                            MAYAD Reach
                        </p>
                        <div className="mt-3 flex items-end gap-3">
                            <span className="text-5xl font-black text-white sm:text-6xl">
                                7,000+
                            </span>
                            <span className="pb-2 text-sm text-slate-400">
                                current internal download milestone
                            </span>
                        </div>

                        <p className="mt-5 text-sm leading-7 text-slate-400">
                            MAYAD is available on Android and iOS. The public Google Play
                            listing may display a different rounded download counter;
                            7,000+ is presented here as the current internal milestone.
                        </p>

                        <div className="mt-6 flex flex-wrap gap-3">
                            <a
                                href="https://play.google.com/store/apps/details?id=com.mayad.app"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
                            >
                                <Smartphone className="h-4 w-4 text-mayad-gold" />
                                Google Play
                            </a>

                            <a
                                href="https://apps.apple.com/in/app/mayad/id6759036727"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
                            >
                                <Smartphone className="h-4 w-4 text-mayad-gold" />
                                App Store
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* =========================================================
          BIO
      ========================================================= */}
            <section className="py-20">
                <div className="mx-auto w-full max-w-5xl px-5 text-center sm:px-8">
                    <p className="text-xs font-bold uppercase tracking-[0.28em] text-mayad-gold">
                        Professional Biography
                    </p>

                    <h2 className="mt-4 text-3xl font-black sm:text-4xl">
                        DP Singh Basni
                    </h2>

                    <p className="mx-auto mt-7 max-w-4xl text-sm leading-8 text-slate-400 sm:text-base">
                        DP Singh Basni is a Rajasthani filmmaker, director, writer, actor
                        and singer, and the Founder & CEO of MAYAD Studios / MAYAD OTT. He
                        has directed and written Rajasthani films including Maa Hadi Rani,
                        Maa Padmavati, Sanwariya Seth, Sanwariya Seth 2 and Vadlya Hindva.
                        He has also acted in Sanwariya Seth and Vadlya Hindva. As a singer,
                        he has released multiple Rajasthani and Hindi music projects under
                        the professional name DP Singh Basni. Through MAYAD, his broader
                        creative vision is focused on building a dedicated digital
                        ecosystem for Rajasthani cinema, music, language, culture, artists
                        and emerging talent, with the aim of taking Rajasthan&apos;s
                        stories to audiences across India and internationally.
                    </p>
                    <div className="mt-9 flex flex-wrap justify-center gap-3">
                        {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => (
                            <a
                                key={label}
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-200 transition-all hover:border-mayad-gold/40 hover:bg-mayad-gold/10 hover:text-white"
                            >
                                <Icon className="h-4 w-4 text-mayad-gold" />
                                <span>{label}</span>
                                <ArrowUpRight className="h-3.5 w-3.5 text-slate-400" />
                            </a>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
}
