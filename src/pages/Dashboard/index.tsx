import { useState, useEffect } from "react";

import Header from "../../components/Header";
import api from "../../services/api";
import Food from "../../components/Food";
import ModalAddFood from "../../components/ModalAddFood";
import ModalEditFood from "../../components/ModalEditFood";
import { FoodsContainer } from "./styles";

export default function Dashboard() {
  const [foods, setFoods] = useState<any>([]);
  const [editingFood, setEditingFood] = useState<any>();
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    async function getFoods() {
      try {
        const response = await api.get("/foods");

        setFoods(response.data);
      } catch (error) {
        console.log(error);
      }
    }

    getFoods();
  }, []);

  const handleAddFood = async (food: any) => {
    try {
      const response = await api.post("/foods", {
        ...food,
        available: true,
      });
      setFoods((oldState: any) => [...oldState, response.data]);
      setModalOpen(false);
    } catch (err) {
      console.log(err);
    }
  };

  const handleUpdateFood = async (food: any) => {
    try {
      const foodUpdated = await api.put(`/foods/${editingFood.id}`, {
        ...editingFood,
        ...food,
      });

      const foodsUpdated = foods.map((f: any) =>
        f.id !== foodUpdated.data.id ? f : foodUpdated.data
      );

      setEditingFood(foodsUpdated);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteFood = async (id: string) => {
    await api.delete(`/foods/${id}`);

    const foodsFiltered = foods.filter((food: any) => food.id !== id);

    setEditingFood(foodsFiltered);
  };

  const toggleModal = () => {
    setModalOpen(true);
  };

  const toggleEditModal = () => {
    setEditModalOpen(false);
  };

  const handleEditFood = (food: any) => {
    setEditingFood(food);
    setEditModalOpen(true);
  };

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods?.length &&
          foods.map((food: any) => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  );
}
