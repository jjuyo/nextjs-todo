"use client"

import { useState } from "react";
import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, 
        Input, Button, Popover, PopoverContent, PopoverTrigger, Spinner,
        Dropdown, DropdownTrigger, DropdownMenu, DropdownItem,
        Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure} from "@nextui-org/react";
import { VerticalDotsIcon } from "./icons";
import {CustomModalType, Todo} from "@/types"
import {useRouter} from "next/navigation"
import {FocusedTodoType} from"@/types"
import CustomModal from "./custom-modal";
const TodosTable = ({todos}:{todos:Todo[]}) => {

  //할일 추가가능 여부
  const [todoAddEnable, setTodoAddEnable] = useState(false);

  //입력된 할일
  const [newTodoInput, setNewTodoInput] = useState('');
  
  //로딩 상태
  const [isLoading, setIsLoading] = useState<Boolean>(false);

  //모달 상태
  const [currentModalData, setCurrentModalData] = useState<FocusedTodoType>({
    focusedTodo: null,
    modalType: 'detail' as CustomModalType
  });

  const router = useRouter();

  const addATodoHandler = async (title:string) => {
    if(!newTodoInput){return}
    
    setTodoAddEnable(false);
    setIsLoading(true);
    
    await new Promise(f => setTimeout(f, 600));
    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/todos/`, {
      method:'post',
      body:JSON.stringify({
        title:title
      }),
      cache:'no-store'
    });
    setNewTodoInput('');
    router.refresh();
    setIsLoading(false);
    notifySuccessEvent("할일을 추가하였습니다!");
    console.log(`할일 추가 완료: ${newTodoInput}`);
  };

  const editATodoHandler = async (
    id : string, editedTitle:string, editedIsDone : boolean) => {
    
    setIsLoading(true);
    
    await new Promise(f => setTimeout(f, 600));
    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/todos/${id}`, {
      method:'post',
      body:JSON.stringify({
        title:editedTitle,
        is_done: editedIsDone
      }),
      cache:'no-store'
    });
    router.refresh();
    setIsLoading(false);
    notifySuccessEvent("할일이 수정되었습니다!");
    console.log(`할일 수정 완료: ${newTodoInput}`);
  };

  const deleteATodoHandler = async (
    id : string) => {
    
    setIsLoading(true);
    
    await new Promise(f => setTimeout(f, 600));
    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/todos/${id}`, {
      method:'delete',
      cache:'no-store'
    });
    router.refresh();
    setIsLoading(false);
    notifySuccessEvent("할일이 삭제되었습니다!");
    console.log(`할일 삭제 완료: ${newTodoInput}`);
  };

  const DisabledTodoAddButton = () => {
    return <Popover placement="top" showArrow={true}>
            <PopoverTrigger>
              <Button color="default" className="h-14">
                ADD
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <div className="px-1 py-2">
                <div className="text-small font-bold">🙋🏻</div>
                <div className="text-tiny">할일을 입력해주세요</div>
              </div>
            </PopoverContent>
          </Popover>
  }

  const applyIsDoneUI = (isDone:boolean) => 
  (isDone? "line-through text-gray-900/50 dark:text-white/40": "")

  function formatDate(dateString : Date) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    const hours = ("0" + date.getHours()).slice(-2);
    const minutes = ("0" + date.getMinutes()).slice(-2);
    const seconds = ("0" + date.getSeconds()).slice(-2);
  
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }
  
  const TodoRow = (aTodo:Todo) => {
return <TableRow key={aTodo.id}>
          <TableCell className={applyIsDoneUI(aTodo.is_done)}>{aTodo.id.slice(0, 3)}</TableCell>
          <TableCell className={applyIsDoneUI(aTodo.is_done)}>{aTodo.title}</TableCell>
          <TableCell >{aTodo.is_done? "✔️" : "❌"}</TableCell>
          <TableCell className={applyIsDoneUI(aTodo.is_done)}>{formatDate(aTodo.created_at)}</TableCell>         
          <TableCell >
          <div className="relative flex justify-end items-center gap-2">
            <Dropdown>
              <DropdownTrigger>
                <Button isIconOnly size="sm" variant="light">
                  <VerticalDotsIcon className="text-default-300" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu onAction={(key)=>{
                console.log(`aTodo.id: ${aTodo.id}/ key: ${key}`);
                setCurrentModalData({focusedTodo : aTodo, modalType: key as CustomModalType})
                onOpen();
              }}>
                <DropdownItem key="detail">View</DropdownItem>
                <DropdownItem key="edit">Edit</DropdownItem>
                <DropdownItem key="delete">Delete</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
          </TableCell>
          </TableRow>
}

const notifySuccessEvent = (msg: string) => toast.success(msg);

const {isOpen, onOpen, onOpenChange} = useDisclosure();

const ModalComponent = () => {
  return<div>
  <Modal  backdrop="blur" isOpen={isOpen} onOpenChange={onOpenChange}>
    <ModalContent>
      {(onClose) => (
        (currentModalData.focusedTodo &&<CustomModal 
          focusedTodo={currentModalData.focusedTodo}
          modalType={currentModalData.modalType}
          onClose={onClose}
          onEdit={async (id, title, isDone)=>{
            console.log(id, title, isDone);
            await editATodoHandler(id, title, isDone);
            onClose();
          }} 
          onDelete={async (id)=>{
            await deleteATodoHandler(id);
            onClose();
          }}
        />)
      )}
    </ModalContent>
  </Modal>
</div>
}

  return (
    <div className="flex flex-col space-y-2">
      {ModalComponent()}
      <ToastContainer 
        position="top-right"
        autoClose={1800}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
        <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
          <Input type="text" label="새로운 할일" value={newTodoInput} 
          onValueChange={(changedInput) => {
            setNewTodoInput(changedInput)
            setTodoAddEnable(changedInput.length>0);
          }}
          />
          {todoAddEnable ? 
            <Button color="secondary" className="h-14"
              onPress={async ()=>{
                await addATodoHandler(newTodoInput)
              }}
            > 
              ADD
            </Button> : DisabledTodoAddButton()
          }
        </div> 
        <div className="h-6">
        {isLoading && <Spinner color="secondary" size="sm" /> }  
        </div>
    <Table aria-label="Example static collection table">
      <TableHeader>
        <TableColumn>ID</TableColumn>
        <TableColumn>Todo</TableColumn>
        <TableColumn>Done</TableColumn>
        <TableColumn>Date</TableColumn>
        <TableColumn>Action</TableColumn>
      </TableHeader>
      <TableBody emptyContent={"보여줄 데이터가 없습니다."}>
        {todos && todos.map((aTodo: Todo) => (
          TodoRow(aTodo)
        ))}
      </TableBody>
    </Table>
    </div>
  );
}

export default TodosTable;

