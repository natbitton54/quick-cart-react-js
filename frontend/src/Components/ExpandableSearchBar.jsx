import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Navbar.css';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/actions/cartActions';

export const ExpandableSearchBar = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 980);
    const [searchResults, setSearchResults] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const searchContainerRef = useRef(null);
    const dispatch = useDispatch()

    // Toggle the expansion of the search bar
    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
        if (!isExpanded) {
            setSearchQuery('');
            setSearchResults([]);
            setErrorMessage('');
        }
    };

    // Handle input changes in the search field
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    // Adjust based on window size
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 980);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Fetch search results when searchQuery changes
    useEffect(() => {
        if (searchQuery.trim() !== '') {
            const fetchSearchDetails = async () => {
                try {
                    const res = await axios.get(`https://quick-cart-react-js-server.vercel.app/search?query=${searchQuery}`);
                    setSearchResults(res.data);
                    setErrorMessage('');
                } catch (err) {
                    if (err.response && err.response.data && err.response.data.error) {
                        setErrorMessage(err.response.data.error);
                    } else {
                        console.error('Error fetching search results:', err);
                        setErrorMessage('An error occurred while searching. Please try again.');
                    }
                }
            };
            fetchSearchDetails();
        } else {
            setSearchResults([]);
            setErrorMessage('');
        }
    }, [searchQuery]);

    // Handle clicks outside of the search bar
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
                setIsExpanded(false);
                setSearchQuery('');
                setSearchResults([]);
                setErrorMessage('');
            }
        };

        if (isExpanded) {
            document.addEventListener('click', handleClickOutside);
        }

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [isExpanded]);

    const handleAddToCart = (product) => {
        dispatch(addToCart(product))
    }

    return (
        <div
            ref={searchContainerRef}
            style={isMobile ? styles.mobileContainer : (isExpanded ? styles.expandedContainer : styles.container)}
            aria-expanded={isExpanded}
        >
            {(isExpanded || isMobile) && (
                <>
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        style={styles.searchInput}
                    />
                    <FontAwesomeIcon
                        icon={faTimes}
                        style={{ ...styles.icon, ...styles.rightIcon }}
                        onClick={toggleExpand}
                        aria-label="Collapse search"
                    />
                </>
            )}
            <FontAwesomeIcon
                icon={faSearch}
                style={isExpanded || isMobile ? { ...styles.icon, ...styles.leftIcon } : { ...styles.icon, color: '#fff' }}
                onClick={!isExpanded ? toggleExpand : undefined}
                aria-label='Expand search'
            />
            {isExpanded && searchResults.length > 0 && (
                <div style={isMobile ? styles.mobileResultsContainer : styles.resultsContainer}>
                    {searchResults.map(product => (
                        <div  key={product.styleID} style={styles.resultItem}>
                            <img src={product.thumbnail} alt={product.shoeName} style={styles.resultImage} />
                            <div>
                                <p style={styles.resultName}>{product.shoeName}</p>
                                <p style={styles.resultBrand}>{product.brand}</p>
                                <p style={styles.resultPrice}>${product.lowestResellPrice?.stockX}</p> 
                                <button style={styles.button} onClick={() => handleAddToCart(product)}>Add to Cart</button>

                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const styles = {
    mobileContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '270px',
        height: '0px',
        position: 'relative',
        zIndex: 20, // Ensure it appears above other elements
    },
    expandedContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative',
        width: '250px',
        height: '30px',
        borderRadius: '15px',
        transition: 'width 0.3s ease-in-out',
    },
    container: {
        // Default container styles
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
    },
    icon: {
        fontSize: '16px',
        cursor: 'pointer',
        color: '#000',
    },
    leftIcon: {
        position: 'absolute',
        left: '9px',
    },
    rightIcon: {
        position: 'absolute',
        right: '10px',
    },
    searchInput: {
        flex: 1,
        paddingLeft: '30px',
        paddingRight: '30px',
        border: 'none',
        outline: 'none',
        borderRadius: '15px',
        height: '30px',
    },
    resultsContainer: {
        position: 'absolute',
        top: '40px',
        left: 0,
        width: '100%',
        maxHeight: '200px',
        overflowY: 'auto',
        backgroundColor: '#fff',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        borderRadius: '4px',
        zIndex: 10,
    },
    mobileResultsContainer: {
        position: 'absolute',
        top: '40px',
        left: 0,
        width: '100%',
        maxHeight: '200px',
        overflowY: 'auto',
        backgroundColor: '#fff',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        borderRadius: '4px',
        zIndex: 20,
    },
    resultItem: {
        display: 'flex',
        alignItems: 'center',
        padding: '10px',
        textDecoration: 'none',
        color: '#000',
    },
    resultImage: {
        width: '50px',
        height: '50px',
        marginRight: '10px',
    },
    resultName: {
        fontSize: '14px',
        fontWeight: 'bold',
        margin: 0,
    },
    resultBrand: {
        fontSize: '12px',
        color: '#666',
        margin: 0,
    },
    resultPrice: {
        fontSize: '14px', // Adjust size as needed
        fontWeight: 'bold', // Make the price stand out
        color: '#aaa', // Color to distinguish the price
        margin: '0', // Ensure no extra margins
    },
    button: {
       padding: '4px 10px',
       color: '#fff',
       backgroundColor: 'rgb(30, 250, 30)',
       outline: 'none',
       border: 'none',
       borderRadius: '5px',
       marginLeft: '20px',
       marginTop: '5px'
    },
};
