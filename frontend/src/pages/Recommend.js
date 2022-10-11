import React, { useEffect, useState } from 'react';
import ArtistReco from '../components/Recommend/ArtistReco';
import CategoryReco from '../components/Recommend/CategoryReco';
import RegionReco from '../components/Recommend/RegionReco';
import UserReco from '../components/Recommend/UserReco';
import { Tabs, Tab } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { getStoreList } from '../_action/store_action';
import { useLocation } from 'react-router-dom';
import { getBookmarkReccom } from '../_action/book_action';

const Recommend = () => {
  const location = useLocation();
  const dispatch = useDispatch();

  const [keyVal, setKeyVal] = useState(location.state.isUserRecom);
  const [mainArtist, setMainArtist] = useState(null);
  
  const { center, storeList } = useSelector((state) => ({
    center:state.map.center,
    storeList:state.store.storeList,
  }))

  const { access } = useSelector((state) => ({
    access: state.user.access,
  }));

  // 탭 이동
  const handelTab = (e) => {
    setKeyVal(e)
    if(e == "user") {
      dispatch(getBookmarkReccom(access))
      .catch((err) => console.log(err))
    } else {
      dispatch(getStoreList('all', [], '', 1))
      .catch((err) => console.log(err));
    }
  };

  useEffect(() => {
    if (location.state.mainArtist != "") {
      dispatch(getStoreList('artist', [location.state.mainArtist], '', 1))
      .then((res) => 
        setMainArtist(null)
        )
      .catch((err) => console.log(err));
    } else {
      dispatch(getStoreList('all', [], '', 1))
      .catch((err) => console.log(err));
    }
  }, [mainArtist]);


  return (
    <div className='reco'>
      <Tabs
        defaultActiveKey='artist'
        className='reco-tabs'
        onSelect={(e) => handelTab(e)}
        activeKey={keyVal}
      >
        <Tab className='reco-tab' eventKey='artist' title='아티스트 추천'>
          <ArtistReco />
        </Tab>
        <Tab className='reco-tab' eventKey='category' title='카테고리 추천'>
          <CategoryReco />
        </Tab>
        <Tab className='reco-tab' eventKey='region' title='지역 추천'>
          <RegionReco />
        </Tab>
        <Tab className='reco-tab' eventKey='user' title='사용자 추천'>
          {/* <UserReco changeTab={this.handleSelect} /> */}
          <UserReco />
        </Tab>
      </Tabs>
    </div>
  );
};

export default Recommend;
