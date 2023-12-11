import { MdKeyboardArrowDown } from 'react-icons/md';

export default function HeaderAccount() {
  return (
    <div className="headeraccount">
      <div>
        <img
          src="./GavinAvatar.jpg"
          className="headeraccount-avatar"
          alt="avatar"
        />
      </div>
      <div className="header-text-Container">
        <div className="headeraccount-text">Welcome Back!</div>
        <div className="headeraccount-name">Gavin</div>
      </div>
      <div onClick={() => {}} className="headeraccount-arrow">
        <MdKeyboardArrowDown />
      </div>
    </div>
  );
}
