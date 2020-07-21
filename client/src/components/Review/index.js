import React, { useState, useEffect, useRef } from 'react';
import { Input, Rating, TextArea, FormBtn } from '../Form';
import API from "../../utils/API";
import AUTH from "../../utils/AUTH";
import '../../App.css';

const Review = props => {
    const [user, setUser] = useState({
        username: '',
        firstName: '',
        lastName: ''
    });
    const [showModal, setModal] = useState(false);
    const [formObject, setFormObject] = useState({
        title: '',
        message: '',
        rating: 0,
        location: ''
    });
    const [reviewRating, setRatings] = useState(0);
    const formEl = useRef(null);

    useEffect(() => {
        AUTH.getUser().then(res => {
            const { username, firstName, lastName } = res.data.user
            setUser({username, firstName, lastName});
        })
        .catch(err => console.log(err));
    }, []);

    useEffect(() => {
        console.log('formObject rating: ', formObject.rating);
    }, [reviewRating]);

    // Handles updating component state when the user types into the input field
    const handleInputChange = event => {
        const { name, value } = event.target;
        setFormObject({...formObject, [name]: value})
    };

    const handleRatingChange = rating => {
        setRatings(rating);
        setFormObject({...formObject, rating: rating})
    }

    const handleFormSubmit = event => {
        event.preventDefault();
        
        if (formObject.title && formObject.location) {
            API.saveReview({
                reviewOwner: user.username,
                reviewOwnerFirstName: user.firstName,
                reviewOwnerLastName: user.lastName,
                reviewCreated: Date.now(),
                reviewTitle: formObject.title,
                reviewBody: formObject.message,
                reviewRating: formObject.rating,
                reviewLocation: formObject.location
            })
            .then(res => {
                formEl.current.reset();
                setRatings(0);
                setFormObject({rating: 0});
                closeReviewForm();
                //loadReviews();
            })
            .catch(err => console.log(err));
        }
    };

    const showReviewForm = () => {
        setModal(true);
    }

    const closeReviewForm = () => {
        setModal(false);
    }

    return (
        <>
        <a className="button is-link" onClick={showReviewForm}>Modal</a>
        <div className={showModal ? 'is-active modal' : 'modal'} id="review-modal">
            <div className="modal-background"></div>
                <div className="modal-content">
                    <div className="form">
                        <h2>Write a Review</h2>
                            <form ref={formEl}>
                                <Input
                                    onChange={handleInputChange}
                                    name="title"
                                    title="Title"
                                    placeholder="Title (required)"
                                />
                                <TextArea
                                    onChange={handleInputChange}
                                    name="message"
                                    title="Message"
                                    placeholder="Message"
                                />
                                <Rating
                                    name="rating"
                                    reviewRating={reviewRating}
                                    handleRatingChange={handleRatingChange}
                                />
                                <Input
                                    onChange={handleInputChange}
                                    name="location"
                                    title="Location"
                                    placeholder="Location (required)"
                                />
                                <FormBtn
                                    disabled={!(formObject.title && formObject.location)}
                                    onClick={handleFormSubmit}
                                    >
                                    Submit Review
                                </FormBtn>
                            </form>
                    </div>
                </div>
            <button className="modal-close is-large" aria-label="close" onClick={closeReviewForm}></button>
        </div>
        </>
    ) 
};
  
export default Review;
