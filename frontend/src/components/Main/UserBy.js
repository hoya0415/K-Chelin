import { Button } from '@mui/material';
import {React, useState} from 'react';
import { Link } from 'react-router-dom';
import Recommend from '../../pages/Recommend';

const UserBy = (props) => {
  // const [activeTab, setActiveTab] = useState(1)
  // const [key, setKey] = useState('user')
  const imgLst = [
    'http://pbs.twimg.com/media/FJSvaCYUcAEXerG.jpg', 
    'http://pbs.twimg.com/media/EwVzwlHU8AIBETp.jpg', 
    'http://pbs.twimg.com/media/FH1qyTCacAM1-Bi.jpg', 
    'http://pbs.twimg.com/media/FH11sVNaMAIQJQJ.jpg',
    'http://pbs.twimg.com/media/FHSVzSfaQAA1dSi.jpg',
    'http://pbs.twimg.com/media/EuHYmXUUUAMAk9v.jpg',
    'http://pbs.twimg.com/media/EfOexRWU4AUnYb8.jpg',
    'http://pbs.twimg.com/media/FALyN0DVEAQp1bJ.jpg',
    'http://pbs.twimg.com/media/FIfM78tagAYdR1B.jpg',
  ];

  const showImg = imgLst[Math.floor(Math.random() * imgLst.length)];

  // const eventHandler = () => {
  //   this.props.changeTab("user")
  // }
  return (
    <div className='userby'>
      <div className='user-title-container'>
        <div className='user-title'>#아무거나_말고_이거</div>
        <div className='user-subtitle'>
          포크한 가게와 비슷한 찐맛집만 모아모아
        </div>
      </div>
      <div className='center'>
        <section className='skewdBox'>
          <div className='container'>
            <div className='user-text'>
              <h4>
                #나만을_위한
                <br />
                _맛집_추천
              </h4>
              <h5>
                이런 맛집도 <br />
                좋아하실 것 같아요!
              </h5>
            </div>
            <div className='userby-btn'>
              <Link to ='/recommend' state={{mainArtist: '', isUserRecom: 'user'}}
              >
              <Button>지금 확인하기</Button>
              </Link>
            </div>
          </div>
        </section>
        <section class='section2'>
          <div class='container'>
            <div className='user-img'>            
              {/* <img src='https://ww.namu.la/s/8005b6932410c808e3e80ec6452d0f3a5303287d99e1d897aacdf175a44da36c5e5f7f73f82bc6617155a7b3787558093a366ed7509ee7de246278eed95e8270a245dd25494cdee712b4a50205c3ee4e28e10969e1d3fe1575e46e5e54fcb77d' /> */}

              {/* <img src='http://pbs.twimg.com/media/FJSvaCYUcAEXerG.jpg' />
              <img src='http://pbs.twimg.com/media/EwVzwlHU8AIBETp.jpg' />
              <img src='http://pbs.twimg.com/media/E_dOXStUcAIjchU.jpg' />
              <img src='http://pbs.twimg.com/media/Ew5XOiaVEAQOTfF.jpg' />
              <img src='http://pbs.twimg.com/media/FH1qyTCacAM1-Bi.jpg' />
              <img src='http://pbs.twimg.com/media/FJCj1NYVIAAQYhA.jpg' />
              <img src='http://pbs.twimg.com/media/FJwrbB4aIAIqZs7.jpg' />
              <img src='http://pbs.twimg.com/media/E-qy-csVgAUiMbA.jpg' />
              <img src='http://pbs.twimg.com/media/FJWiW5JagAMfrUL.jpg' />
              <img src='http://pbs.twimg.com/media/EySbji9UUAIa2h5.jpg' /> */}
              
              <img src={showImg} />
              
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default UserBy;
