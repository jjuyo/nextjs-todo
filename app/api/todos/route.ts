import { NextRequest, NextResponse } from "next/server";
import dummyTodos from '@/data/dummy.json'
import {addATodo, fetchTodos} from '@/data/firestore'

// 모든 할 일 가져오기
export async function GET(request: NextRequest) {

    const fetchedTodos = await fetchTodos();
    const response = {
        message: 'todos 몽땅 가져오기',
        data : fetchedTodos
    }
   return NextResponse.json(response, {status:200});
    // get방식으로 라우팅하면 이게 들어옴
  }

  // 할 일 추가
  export async function POST(request: NextRequest) {
  
    const {title} = await request.json();

    if (title === undefined){

        const errMessage = {
            message : '할 일을 입력해주세요'
        }
        return NextResponse.json(errMessage, {status:422}); //422 mdn422 서버에서 데이터가 없을 경우
    }

    const addedTodo = await addATodo({title});

    const response ={
        message: '할일 추가 성공',
        data : addedTodo   
    }
    return Response.json(response, {status: 201});
    //const{title} 이렇게 하고 json{title} 이렇게 하면 title만 받음
    //data이렇게 하면 다 받음
  }