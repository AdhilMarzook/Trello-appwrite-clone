import { databases } from '@/appwrite';
import { getTodosGroupedByColumn } from '@/lib/getTodosGroupedByColumn';
import { create } from 'zustand'

interface BoardState{
    board: Board;
    getBoard:() => void;
    setBoardState: (board: Board) => void;
    updateTodoInDB: (todo: Todo, columnId: TypedColumn) => void;

    searchString: string;
    setSearchString: (searchString: string) => void;
}

export const useBoardStore = create<BoardState>((set) => ({
  board: {
    columns: new Map<TypedColumn,Column>()
    },
    
  searchString:"",
    setSearchString:(searchString) => set({ searchString}),

  getBoard: async() => {
    const board = await getTodosGroupedByColumn();
    set({ board});
  },

  setBoardState:(board) => set({board}),

  updateTodoInDB: async(todo, coulmnId) => {
    await databases.updateDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
      todo.$id,
      {
        title: todo.title,
        status: coulmnId,
      }
    );
  },

}));