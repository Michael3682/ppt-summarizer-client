export default function Logo({ size = 50 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
            <path d="M42 23.0001C42.0069 25.6398 41.3901 28.2438 40.2 30.6001C37.3219 36.3587 31.4378 39.9976 25 40.0001C22.3603 40.0069 19.7562 39.3902 17.4 38.2001L6 42.0001L9.8 30.6001C8.60986 28.2438 7.99312 25.6398 8 23.0001C8.00249 16.5622 11.6413 10.6781 17.4 7.80006C19.7562 6.60992 22.3603 5.99317 25 6.00006H26" stroke="var(--tertiary)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M32 6H42V16" stroke="var(--tertiary)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M26 22L42 6" stroke="var(--tertiary)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    )
}