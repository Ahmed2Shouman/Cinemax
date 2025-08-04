import * as theaterModel from '../models/theaterModel.js';

export const getAllTheaters = async (req, res) => {
  try {
    const theaters = await theaterModel.getAllTheaters();
    res.json(theaters);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTheaterById = async (req, res) => {
  try {
    const theater = await theaterModel.getTheaterById(req.params.id);
    if (theater) {
      res.json(theater);
    } else {
      res.status(404).json({ message: 'Theater not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createTheater = async (req, res) => {
  try {
    const { name, location, capacity } = req.body;
    const newTheater = await theaterModel.createTheater(name, location, capacity);
    res.status(201).json(newTheater);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateTheater = async (req, res) => {
  try {
    const { name, location, capacity } = req.body;
    const updatedTheater = await theaterModel.updateTheater(req.params.id, name, location, capacity);
    if (updatedTheater) {
      res.json(updatedTheater);
    } else {
      res.status(404).json({ message: 'Theater not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteTheater = async (req, res) => {
  try {
    const result = await theaterModel.deleteTheater(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
