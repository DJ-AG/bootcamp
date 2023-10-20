const Box = ({ data }) => (
    <div className="w-full sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-2/5 cursor-pointer p-4 m-2 md:m-4 rounded-lg shadow-lg flex flex-col justify-between hover:bg-gray-800">
        {/* Image at the top */}
        <img src="https://via.placeholder.com/150" alt="Placeholder" className="mb-4 rounded-t-lg w-full h-40 object-cover" />
    
        {/* Split data into two columns using Flex */}
        <div className="flex flex-col md:flex-row justify-between text-gray-400">
            <div className="mb-4 md:mb-0 pr-2"> {/* Left column */}
                <div className={`font-semibold tracking-wide p-1 rounded ${data.hover ? 'bg-gray-600' : 'bg-gray-800'} text-white`}><span>Name:</span></div>
                <div className="text-gray-600">{data.name}</div>
                <div className={`font-semibold tracking-wide p-1 rounded mt-2 ${data.hover ? 'bg-gray-600' : 'bg-gray-800'} text-white`}><span>Description:</span></div>
                <div className="text-gray-600">{data.description}</div>
                <div className={`font-semibold tracking-wide p-1 rounded mt-2 ${data.hover ? 'bg-gray-600' : 'bg-gray-800'} text-white`}><span>Website:</span></div>
                <div className="text-gray-600">{data.website}</div>
            </div>
    
            <div className="pl-2"> {/* Right column */}
                <div className={`font-semibold tracking-wide p-1 rounded ${data.hover ? 'bg-gray-600' : 'bg-gray-800'} text-white`}><span>Phone:</span></div>
                <div className="text-gray-600">{data.phone}</div>
                <div className={`font-semibold tracking-wide p-1 rounded mt-2 ${data.hover ? 'bg-gray-600' : 'bg-gray-800'} text-white`}><span>Email:</span></div>
                <div className="text-gray-600">{data.email}</div>
                <div className={`font-semibold tracking-wide p-1 rounded mt-2 ${data.hover ? 'bg-gray-600' : 'bg-gray-800'} text-white`}><span>Address:</span></div>
                <div className="text-gray-600">{data.address}</div>
                <div className={`font-semibold tracking-wide p-1 rounded mt-2 ${data.hover ? 'bg-gray-600' : 'bg-gray-800'} text-white`}><span>Careers:</span></div>
                <div className="text-gray-600">{data.careers}</div>
                {/* Add other fields as needed */}
            </div>
        </div>
    </div>
  );
  
  export default Box;