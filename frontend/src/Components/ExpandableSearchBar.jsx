import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/actions/cartActions';
import { toast } from 'react-toastify';
import { useAuth } from '../pages/auth/firebase.js';

export const ExpandableSearchBar = ({ onSearch }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 1050);
    const [searchResults, setSearchResults] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const searchContainerRef = useRef(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { currentUser } = useAuth();

    useEffect(() => {
        if (isMobile) {
            setIsExpanded(true);
        }
    }, [isMobile]);

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
        if (!isExpanded) {
            setSearchQuery('');
            setSearchResults([]);
            setErrorMessage('');
        }
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        fetchSearchDetails(e.target.value);  // Fetch results as user types
    };

    const fetchSearchDetails = async (query) => {
        if (query.trim() === '') {
            setSearchResults([]);
            return;
        }

        try {
            const res = await axios.get(`http://localhost:3000/api/search?query=${query}`);
            setSearchResults(res.data);
            setErrorMessage('');
            onSearch && onSearch();
        } catch (err) {
            if (err.response && err.response.data && err.response.data.error) {
                setErrorMessage(err.response.data.error);
            } else {
                console.error('Error fetching search results:', err);
                setErrorMessage('An error occurred while searching. Please try again.');
            }
        }
    };

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 1050);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

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
        if (!currentUser) {
            toast.error("Please log in to add items to the cart.");
            navigate('/login');
        } else {
            dispatch(addToCart(product));
            toast.success("Item added to cart!");
        }
    };

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
                onClick={async () => {
                    if (!isExpanded) {
                        toggleExpand();
                    }
                }}
                aria-label='Expand search'
            />
            {isExpanded && searchResults.length > 0 && (
                <div style={isMobile ? styles.mobileResultsContainer : styles.resultsContainer}>
                    {searchResults.map(product => (
                        <div key={product.styleID} style={styles.resultItem}>
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
