import React, { useEffect } from 'react';
import { useAppContext } from '../Redux/appContext';
import Box from './Box';
import Loading from './Loading';

const BoxGrid = () => {
  const { getBootcamps, data, isLoading } = useAppContext();

  useEffect(() => {
    getBootcamps();
  }, []); 

  console.log("This is data -> ", data);

  if (isLoading) {
    return (
      <Loading/>
    );
  }

  return (
    <div className="flex flex-wrap justify-center">
      {data.map((dataItem) => (
        <Box key={dataItem.name} data={dataItem} />
      ))}
    </div>
  );
};

export default BoxGrid;