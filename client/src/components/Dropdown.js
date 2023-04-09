import Select from "react-select";
import makeAnimated from "react-select/animated";

const Dropdown = ({ id, label, placeholder, options, value, cb }) => {

    const animatedComponents = makeAnimated();
    
    return (
    <div className="pt-4 pb-4">
        <label className="w-full block pb-1" for={id}> 
            {label}
        </label>
        <div className="cursor-pointer">
            <Select 
                id={id}
                closeMenuOnSelect={true}
                components={animatedComponents}
                placeholder={placeholder}
                defaultValue={options[1]}
                options={options}
                onChange={cb}
                value={value}
                isClearable 
                styles={{
                    control: (base, {isFocused, menuIsOpen}) => ({
                        ...base,
                        background: 'rgb(17 24 39)',
                        borderColor: 'rgb(156 163 175)',
                        borderRadius: '0.375rem',
                        paddingBottom: 2,
                        paddingTop: 2,
                        transition: 'ease-in-out',
                        transitionDuration: '300ms',
                        color: '#9CA3AF',
                        cursor: 'pointer',
                        '&:hover': {
                            borderColor: 'rgb(29 78 216)'
                        }
                    }),
                    menu: (base) => ({
                        ...base,
                        background: 'rgb(17 24 39)'
                    }),
                    placeholder: (base) => ({
                        ...base,
                        color: '#9CA3AF'
                    }),
                    singleValue: (base) => ({
                        ...base,
                        color: 'white'
                    }),
                    input: (base) => ({
                        ...base,
                        color: 'white'
                    }),
                    option: (base, { isFocused, isSelected }) => ({
                        ...base,
                        color: 'white',
                        cursor: 'pointer',
                        background: isFocused ? 'rgb(31 41 55)' : 'rgb(17 24 39)'
                    }),
                }}
            />
        </div>
    </div>
    );
}

export default Dropdown;