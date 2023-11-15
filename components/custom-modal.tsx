"use client"
import React, { useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import {Input, Button, Modal, ModalContent, Checkbox,Switch, ModalHeader, ModalBody, ModalFooter, useDisclosure, CircularProgress} from "@nextui-org/react";
import {CustomModalType, Todo} from "@/types"
import { isFunctionOrConstructorTypeNode } from 'typescript';
import { calculateSizeAdjustValues } from 'next/dist/server/font-utils';

const CustomModal = ({focusedTodo, modalType, onClose, onEdit, onDelete}:{
    focusedTodo:Todo, 
    modalType:CustomModalType,
    onClose: ()=> void,
    onEdit: (id:string, title:string, isDone:boolean) => void,
    onDelete: (id:string) => void
}) => {


    // 현재 완료 상태
    const [isDone, setIsDone] = useState(focusedTodo.is_done);

    // 로딩상태
    const [isLoading, setIsLoading] = useState(false);

    // 수정된 할일 입력
    const [editedTodoInput, setEditedTodoInput] = useState<string>(focusedTodo.title);

    const DetailModal = () => {
        return<>
        <ModalHeader className="flex flex-col gap-1">할일 상세</ModalHeader>
        <ModalBody>
          <p><span className='font-bold'>id: </span>{focusedTodo.id}</p>
          <p><span className='font-bold'>할일 내용: </span>{focusedTodo.title}</p>
          <div className="flex py-2 space-x-4">
            <span className='font-bold'>완료여부 :</span>
          {`${focusedTodo.is_done? '완료' : '미완료'}`}
          </div>
          <div className="flex py-1 space-x-4">
            <span className='font-bold'>작성일 :</span>
          {`${focusedTodo.created_at}`}
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="default" onPress={onClose}>
            Close
          </Button>
        </ModalFooter>
      </>
    }

    const EditModal = () => {
        return<>
        <ModalHeader className="flex flex-col gap-1">할일 수정</ModalHeader>
        <ModalBody>
          <p><span className='font-bold'>id: </span>{focusedTodo.id}</p>
          <Input
            autoFocus
            label="할일 내용"
            placeholder="할 일을 입력해주세요"
            variant="bordered"
            defaultValue={focusedTodo.title}
            isRequired
            value={editedTodoInput}
            onValueChange={setEditedTodoInput}
          />
          <div className="flex py-2 space-x-4">
            <span className='font-bold'>완료여부 :</span>
          <Switch defaultSelected={focusedTodo.is_done} 
          onValueChange={setIsDone}
          aria-label="Automatic updates"
          color="secondary"
          >  
          </Switch>
          {`${isDone? '완료' : '미완료'}`}
          </div>
          <div className="flex py-1 space-x-4">
            <span className='font-bold'>작성일 :</span>
          {`${focusedTodo.created_at}`}
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" variant="flat" onPress={()=>{
            setIsLoading(true);
            onEdit(focusedTodo.id, editedTodoInput, isDone);
          }}>
            {(isLoading)? <CircularProgress size = "sm" color='secondary' aria-label="Loading..."/>:  "수정"}
          </Button>
          <Button color="default" onPress={onClose}>
            Close
          </Button>
        </ModalFooter>
      </>
    }

    const DeleteModal = () => {
        return<>
        <ModalHeader className="flex flex-col gap-1">할일 삭제</ModalHeader>
        <ModalBody>
          <p><span className='font-bold'>id: </span>{focusedTodo.id}</p>
          <p><span className='font-bold'>할일 내용: </span>{focusedTodo.title}</p>
          <div className="flex py-2 space-x-4">
            <span className='font-bold'>완료여부 :</span>
          {`${focusedTodo.is_done? '완료' : '미완료'}`}
          </div>
          <div className="flex py-1 space-x-4">
            <span className='font-bold'>작성일 :</span>
          {`${focusedTodo.created_at}`}
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="flat" onPress={()=>{
            setIsLoading(true);
            onDelete(focusedTodo.id);
          }}>
            {(isLoading)? <CircularProgress size = "sm" color='danger' aria-label="Loading..."/>:  "삭제"}
          </Button>
          <Button color="default" onPress={onClose}>
            Close
          </Button>
        </ModalFooter>
      </>
    }


    const getModal = (type: CustomModalType)=>{
        switch(type){
            case 'detail':
                return DetailModal();
            case 'delete':
                return DeleteModal();
            case 'edit':
                return EditModal();
                default: break;
        }
    }

    return (
        <>
            {getModal(modalType)}
        </>
    )
}

export default CustomModal;
