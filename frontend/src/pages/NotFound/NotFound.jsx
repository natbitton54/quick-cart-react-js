import React, { useEffect } from 'react';
import './not-found.css'
import { Link } from 'react-router-dom';

const NotFound = () => {
    useEffect(() => {
        document.title = "404 Not Found"
    }, [])
    return (
        <div style={styles.body}>
            <h1 style={styles.h1} className='h1-404'>404</h1>
            <div className="cloak__wrapper" style={styles.cloakWrapper}>
                <div className="cloak__container" style={styles.cloakContainer}>
                    <div className="cloak" style={styles.cloak}></div>
                </div>
            </div>
            <div className="info-404" style={styles.info}>
                <h2 className='h2-404'>Page Not Found.</h2>
                <p className='p-404' style={styles.infoP}>We're sorry, the page you were looking for isn't found here. The link you followed may either be broken or no longer exists. </p>
                <Link className='a-404' to="/" rel="noreferrer noopener" style={styles.a}>Home</Link>
            </div>
        </div>
    );
};

const styles = {
    body: {
        minHeight: '100vh',
        display: 'flex',
        fontFamily: "'Roboto', sans-serif",
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#737373',
        color: '#fafafa',
        perspective: '1200px',
        transformStyle: 'preserve-3d',

    },
    h1: {
        animation: 'swing 2s infinite alternate ease-in-out',
        fontSize: 'clamp(5rem, 40vmin, 20rem)',
        fontFamily: "'Open Sans', sans-serif",
        margin: 0,
        marginBottom: '1rem',
        letterSpacing: '1rem',
        transform: 'translate3d(0, 0, 0vmin)',
        '--x': 'calc(50% + (var(--swing-x) * 0.5) * 1%)',
        background: 'radial-gradient(var(--lit-header), var(--header) 45%) var(--x) 100%/200% 200%',
        WebkitBackgroundClip: 'text',
        color: '#eee',
        position: 'relative',
        textShadow: '1px 1px 2px #000, 1px 1px 2px #000, 2px 2px 4px #000, 2px 2px 4px #000',
    },
    h1After: {
        animation: 'swing 2s infinite alternate ease-in-out',
        content: '"404"',
        position: 'absolute',
        top: 0,
        left: 0,
        color: '#000',
        filter: 'blur(1.5vmin)',
        transform: 'scale(1.05) translate3d(0, 12%, -10vmin) translate(calc((var(--swing-x, 0) * 0.05) * 1%), calc((var(--swing-y) * 0.05) * 1%))',
    },
    cloakWrapper: {
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        overflow: 'hidden',
    },
    cloakContainer: {
        height: '250vmax',
        width: '250vmax',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
    },
    cloak: {
        animation: 'swing 2s infinite alternate-reverse ease-in-out',
        height: '100%',
        width: '100%',
        transformOrigin: '50% 30%',
        transform: 'rotate(calc(var(--swing-x) * -0.25deg))',
        background: 'radial-gradient(40% 40% at 50% 42%, transparent, #000 35%)',
    },
    info: {
        textAlign: 'center',
        lineHeight: 1.5,
        maxWidth: 'clamp(16rem, 90vmin, 25rem)',
    },
    infoP: {
        marginBottom: '3rem',
        color: "#bfbfbf"
    },
    a: {
        textTransform: 'uppercase',
        textDecoration: 'none',
        background: '#b3b3b3',
        color: '#0a0a0a',
        padding: '1rem 4rem',
        borderRadius: '4rem',
        fontSize: '0.875rem',
        letterSpacing: '0.05rem',
    },
};

export default NotFound;
