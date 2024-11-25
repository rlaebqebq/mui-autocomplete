import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Select, TOption } from '.';

const mockData = [
가  { label: 'Movie A', value: '1' },
  { label: 'Movie B', value: '2' },
  { label: 'Movie C', value: '3' },
  { label: 'Movie D', value: '4' },
  { label: 'Movie E', value: '5' },
  { label: 'Movie F', value: '6' },
  { label: 'Movie G', value: '7' },
  { label: 'Movie H', value: '8' },
  { label: 'Movie I', value: '9' },
  { label: 'Movie J', value: '10' },
];

const fetchData = (): Promise<Array<TOption>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockData);
    }, 300);
  });
};

describe('Select 테스트', () => {
  const handleChange = jest.fn();
  const defaultOption = undefined;
  const selectedOption = mockData[mockData.length - 1];

  const setup = async (options: TOption[] | (() => Promise<Array<TOption>>), value: TOption | undefined) => {
    render(<Select options={options} value={value} onChange={handleChange} />);
    Element.prototype.scrollIntoView = jest.fn();

    if (typeof options === 'function') {
      await waitFor(() => {
        const select = screen.getByTestId('select');
        expect(select).not.toHaveClass('loading');
      });
      await waitFor(() => {
        const select = screen.getByTestId('select');
        expect(select).not.toHaveClass('error');
      });
    }
  };

  const runTests = async (options: TOption[] | (() => Promise<Array<TOption>>), value: TOption | undefined) => {
    it('option을 검색할 수 있어야 한다', async () => {
      await setup(options, value);
      const openBtn = await screen.findByTestId('select-open-btn');
      fireEvent.click(openBtn);

      const optionList = await screen.findByTestId('option-list');
      await waitFor(() => expect(optionList).toBeInTheDocument());
      expect(optionList).toBeVisible();
      const optionButtons = await screen.findAllByTestId('option');

      const textarea = screen.getByTestId('select-textarea');
      fireEvent.change(textarea, { target: { value: 'movie' } });
      expect(textarea).toHaveValue('movie');
      expect(optionButtons.length).toBeGreaterThan(0);
    });
    it('Select를 클릭하면 선택 가능한 option들이 나타나야 한다', async () => {
      await setup(options, value);
      const selectInputArea = screen.getByTestId('select-input-area');
      fireEvent.click(selectInputArea);

      const optionList = await screen.findByTestId('option-list');
      await waitFor(() => expect(optionList).toBeInTheDocument());
      expect(optionList).toBeVisible();
      const optionButtons = await screen.findAllByTestId('option');

      expect(optionButtons.length).toBeGreaterThan(0);
      expect(optionButtons[0]).toBeVisible();
    });

    it('마우스를 사용해 option을 선택할 수 있어야 한다', async () => {
      await setup(options, value);
      const selectInputArea = screen.getByTestId('select-input-area');
      fireEvent.click(selectInputArea);

      const optionList = await screen.findByTestId('option-list');
      await waitFor(() => expect(optionList).toBeInTheDocument());
      expect(optionList).toBeVisible();
      const optionButtons = await screen.findAllByTestId('option');

      expect(optionButtons.length).toBeGreaterThan(0);
      expect(optionButtons[0]).toBeVisible();

      fireEvent.click(optionButtons[0]);
      expect(handleChange).toHaveBeenCalledWith(mockData[0]);
    });

    it('Select에서 위 방향 키보드를 누르면 선택 가능한 option들이 나타나야 한다', async () => {
      await setup(options, value);
      const select = screen.getByTestId('select');
      fireEvent.keyDown(select, { key: 'ArrowUp', code: 'ArrowUp' });

      const optionList = await screen.findByTestId('option-list');
      await waitFor(() => expect(optionList).toBeInTheDocument());
      expect(optionList).toBeVisible();
      const optionButtons = await screen.findAllByTestId('option');

      expect(optionButtons.length).toBeGreaterThan(0);
      expect(optionButtons[0]).toBeVisible();
    });

    it('Select에서 아래 방향 키보드를 누르면 선택 가능한 option들이 나타나야 한다', async () => {
      await setup(options, value);
      const select = screen.getByTestId('select');
      fireEvent.keyDown(select, { key: 'ArrowDown', code: 'ArrowDown' });

      const optionList = await screen.findByTestId('option-list');
      await waitFor(() => expect(optionList).toBeInTheDocument());
      expect(optionList).toBeVisible();
      const optionButtons = await screen.findAllByTestId('option');

      expect(optionButtons.length).toBeGreaterThan(0);
      expect(optionButtons[0]).toBeVisible();
    });

    it('키보드를 사용해 option을 선택할 수 있어야 한다', async () => {
      await setup(options, value);
      const select = screen.getByTestId('select');
      fireEvent.keyDown(select, { key: 'ArrowDown', code: 'ArrowDown' });

      const optionList = await screen.findByTestId('option-list');
      await waitFor(() => expect(optionList).toBeInTheDocument());
      expect(optionList).toBeVisible();
      const optionButtons = await screen.findAllByTestId('option');

      fireEvent.keyDown(select, { key: 'ArrowDown', code: 'ArrowDown' });
      const selectedButtons = optionButtons.filter((i) => i.classList.contains('hovered'));
      expect(selectedButtons.length).toBe(1);
    });
    //
    it('키보드 엔터키를 누르면 option을 선택할 수 있어야 한다', async () => {
      await setup(options, value);
      const select = screen.getByTestId('select');
      fireEvent.keyDown(select, { key: 'ArrowDown', code: 'ArrowDown' });

      const optionList = await screen.findByTestId('option-list');
      await waitFor(() => expect(optionList).toBeInTheDocument());
      expect(optionList).toBeVisible();

      fireEvent.keyDown(select, { key: 'ArrowDown', code: 'ArrowDown' });
      fireEvent.keyDown(select, { key: 'Enter', code: 'Enter' });
      expect(handleChange).toHaveBeenCalledWith(mockData[0]);
    });
  };

  describe('Select에 선택된 값이 없고 options로 배열을 전달', () => {
    runTests(mockData, defaultOption);

    it('option을 선택하지 않고 select에서 focus가 벗어나면 검색어가 삭제된다', async () => {
      await setup(mockData, defaultOption);
      const select = screen.getByTestId('select');
      const textarea = screen.getByTestId('select-textarea');

      fireEvent.change(textarea, { target: { value: 'movie' } });
      expect(textarea).toHaveValue('movie');
      fireEvent.blur(select);
      expect(textarea).toHaveValue('');
    });
  });
  describe('Select에 선택된 값이 없고 options로 함수를 전달', () => {
    runTests(fetchData, defaultOption);

    it('option을 선택하지 않고 select에서 focus가 벗어나면 검색어가 삭제된다', async () => {
      await setup(fetchData, defaultOption);
      const select = screen.getByTestId('select');
      const textarea = screen.getByTestId('select-textarea');
      fireEvent.change(textarea, { target: { value: 'movie' } });
      expect(textarea).toHaveValue('movie');
      fireEvent.blur(select);
      expect(textarea).toHaveValue('');
    });
  });
  describe('Select에 선택된 값이 있고 options로 배열을 전달', () => {
    runTests(mockData, selectedOption);

    it('option들이 나타날때 선택된 option이 보이고 강조되어야 한다', async () => {
      await setup(mockData, selectedOption);
      const openBtn = await screen.findByTestId('select-open-btn');
      fireEvent.click(openBtn);

      const optionList = await screen.findByTestId('option-list');
      await waitFor(() => expect(optionList).toBeInTheDocument());
      expect(optionList).toBeVisible();
      const optionButtons = await screen.findAllByTestId('option');

      await waitFor(() => {
        expect(optionButtons[optionButtons.length - 1]).toBeVisible();
      });
      expect(optionButtons[optionButtons.length - 1]).toHaveClass('selected');
    });

    it('키보드를 이용해 option을 순회할 때, 선택된 option이 시작지점이 되어야 한다', async () => {
      await setup(mockData, selectedOption);
      const select = screen.getByTestId('select');
      fireEvent.keyDown(select, { key: 'ArrowDown', code: 'ArrowDown' });

      const optionList = await screen.findByTestId('option-list');
      await waitFor(() => expect(optionList).toBeInTheDocument());
      expect(optionList).toBeVisible();
      const optionButtons = await screen.findAllByTestId('option');

      await waitFor(() => {
        expect(optionButtons[optionButtons.length - 1]).toBeVisible();
      });
      expect(optionButtons[optionButtons.length - 1]).toHaveClass('hovered');
    });
  });
  describe('Select에 선택된 값이 있고 options로 함수를 전달', () => {
    runTests(fetchData, selectedOption);

    it('option들이 나타날때 선택된 option이 보이고 강조되어야 한다', async () => {
      await setup(fetchData, selectedOption);
      const openBtn = await screen.findByTestId('select-open-btn');
      fireEvent.click(openBtn);

      const optionList = await screen.findByTestId('option-list');
      await waitFor(() => expect(optionList).toBeInTheDocument());
      expect(optionList).toBeVisible();
      const optionButtons = await screen.findAllByTestId('option');

      await waitFor(() => {
        expect(optionButtons[optionButtons.length - 1]).toBeVisible();
      });
      expect(optionButtons[optionButtons.length - 1]).toHaveClass('selected');
    });

    it('키보드를 이용해 option을 순회할 때, 선택된 option이 시작지점이 되어야 한다', async () => {
      await setup(fetchData, selectedOption);
      const select = screen.getByTestId('select');
      fireEvent.keyDown(select, { key: 'ArrowDown', code: 'ArrowDown' });

      const optionList = await screen.findByTestId('option-list');
      await waitFor(() => expect(optionList).toBeInTheDocument());
      expect(optionList).toBeVisible();
      const optionButtons = await screen.findAllByTestId('option');

      await waitFor(() => {
        expect(optionButtons[optionButtons.length - 1]).toBeVisible();
      });
      console.log(optionButtons[optionButtons.length - 1].className);
      expect(optionButtons[optionButtons.length - 1]).toHaveClass('hovered');
    });
  });
});
