import { useState } from 'react';

import { Select, TOption } from '../Select';
import { fetchTop100Films } from './fetchTop100Films';
import top100Films from './top100Films.json';

import './style.css';

const DemoPage = () => {
  const [selectedOption, setSelectedOption] = useState<TOption>();
  const [selectedOption2, setSelectedOption2] = useState<TOption>();

  return (
    <main>
      <Select
        label='Movie'
        value={selectedOption}
        options={top100Films}
        onChange={(value) => setSelectedOption(value)}
      />

      <div className='empty-box'>select 테스트를 위한 빈 박스</div>
      <div className='select-box'>
        <Select
          label='Movie'
          value={selectedOption2}
          options={fetchTop100Films}
          onChange={(value) => setSelectedOption2(value)}
        />
      </div>
      <div className='empty-box'>select 테스트를 위한 빈 박스</div>
    </main>
  );
};

export default DemoPage;
