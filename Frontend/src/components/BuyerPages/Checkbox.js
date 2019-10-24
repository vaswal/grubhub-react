import React from "react";

const divStyle = {
    marginLeft: 20,
};

const Checkbox = ({label, isSelected, onCheckboxChange}) => (
    <div className="form-check">
        <input
            type="checkbox"
            name={label}
            checked={isSelected}
            onChange={onCheckboxChange}
            className="form-check-input"
        />
        <label style={divStyle}>

            {label}
        </label>
    </div>
);

export default Checkbox;