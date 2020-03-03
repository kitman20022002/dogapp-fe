import React from 'react';
import {cleanup, render, fireEvent, wait} from '@testing-library/react';
import '@testing-library/jest-dom';
import '@testing-library/jest-dom/extend-expect';
import Home from '../pages/Home/Home';
import axios from 'axios';
//https://dev.to/mnsr/axios-mocking-in-react-using-typescript-4da0
//https://jestjs.io/docs/en/tutorial-async
//https://www.leighhalliday.com/mocking-axios-in-jest-testing-async-functions
afterEach(cleanup);
jest.mock('axios');
const observe = jest.fn();

window.IntersectionObserver = jest.fn(function () {
    this.observe = observe;
});

test('renders learn react link', async () => {
    axios.get.mockImplementationOnce(() => Promise.reject({
        response: {
            status: 404,
            message: "Breed not found (sub breed does not exist)",
            code: 404
        },
    }));

    const {getByText, getByTestId} = render(<Home/>);
    const searchInputElement = getByTestId('input-search');
    const linkElement = getByTestId('search');

    fireEvent.change(searchInputElement, {target: {value: ''}});
    fireEvent.click(linkElement);

    await wait(() => {
        expect(getByText('Cannot find products')).toBeInTheDocument();
    });
});


test('renders learn react link', async () => {
    axios.get.mockImplementationOnce(() => Promise.resolve(
        {
            data: {
                message: ['https://images.dog.ceo/breeds/hound-afghan/n02088094_1003.jpg', 'https://images.dog.ceo/breeds/hound-afghan/n02088094_1003.jpg', 'https://images.dog.ceo/breeds/hound-afghan/n02088094_1003.jpg'],
                status: "success"
            }
        }
    ));
    const {getByTestId, getAllByTestId} = render(<Home/>);
    const searchInputElement = getByTestId('input-search');
    const linkElement = getByTestId('search');
    fireEvent.change(searchInputElement, {target: {value: 'afghan'}});
    expect(searchInputElement.value).toBe('afghan');
    fireEvent.click(linkElement);
    await wait(() => {
        expect(getAllByTestId('lazyImage').length).toBe(3);
    });
});
