import React from 'react';

function TagInput({ values, setValues, name, label, placeholder }: any) {
    const handleKeyDown = (e: any) => {
        if (e.key === 'Enter' && e.target.value.trim()) {
            e.preventDefault();
            const newTag = e.target.value.trim();
            setValues([...values, newTag]);
            e.target.value = '';
        }
    };

    const removeTag = (indexToRemove: any) => {
        setValues(values.filter((_: any, index: number) => index !== indexToRemove));
    };

    return (
        <div className="flex flex-col w-full max-md:max-w-full items-start ">
            <label className="font-medium text-start text-black max-md:max-w-full mb-2.5">{label}</label>
            <div className="flex flex-wrap border border-solid bg-zinc-100 p-2 w-full min-h-[50px] rounded-lg">
                {values.map((tag: any, index: number) => (
                    <div key={index} className="flex items-center bg-[#FF3E55] text-white rounded-md px-2 py-1 pb-2 mx-1">
                        <span>{tag}</span>
                        <span className="ml-2 cursor-pointer text-white" onClick={() => removeTag(index)}>
                            &times;
                        </span>
                    </div>
                ))}
                <input
                    type="text"
                    onKeyDown={handleKeyDown}
                    className="flex-grow bg-transparent p-1 outline-none px-4 text-black"
                    placeholder={placeholder}
                />
            </div>
        </div>
    );
}

export default TagInput;
