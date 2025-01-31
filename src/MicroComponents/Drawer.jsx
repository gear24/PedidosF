import React from 'react';
import { Link } from 'react-router-dom';

const Drawer = ({ options, closeDrawer }) => {
  return (
    <dialog className="left no-padding" open>
      <nav className="drawer">
        <header>
          <nav>
            <img src="" className="circle" alt="Logo" />
            <h6 className="max">Title</h6>
            <button className="transparent circle large" onClick={closeDrawer}>
              <i>close</i>
            </button>
          </nav>
        </header>

        {options.map((option, index) => (
          <Link key={index} to={option.link}>
            <div>
              <i>{option.icon}</i>
              <span>{option.label}</span>
            </div>
          </Link>
        ))}
      </nav>
    </dialog>
  );
};


export default Drawer;
