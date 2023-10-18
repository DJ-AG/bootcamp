import React from 'react';
import BoxGrid from '../../component/BoxGrid';

function Bootcamps() {
    return (
        <div className="max-w-7xl mx-auto">
            <div className="px-4 py-6 sm:px-0">
                <div className="max-h-[55rem] overflow-y-auto">
                    <BoxGrid/>
                </div>
            </div>
        </div>
    );
}

export default Bootcamps;