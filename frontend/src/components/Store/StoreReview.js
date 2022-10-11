import React from 'react';
import { TwitterTweetEmbed } from 'react-twitter-embed';

const StoreReview = ({ store }) => {

  return (
    <div className='centerContent'>
      <div className='store-review-container selfCenter spaceBetween'>
        {store.reviews.length > 0 ? store.reviews.map((review, i) => (
          <div key={i}>
            <TwitterTweetEmbed tweetId={review} />
          </div>
        )): <div>작성된 리뷰가 없어요😥</div>}
      </div>
    </div>
  );
};

export default StoreReview;
