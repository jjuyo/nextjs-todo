import { NextRequest, NextResponse } from "next/server";
import { fetchATodo, deleteATodo, editATodo } from "@/data/firestore";
//할 일 단일 조회
export async function GET(request: NextRequest , 
    { params }: { params: { slug: string } }) {
//여기에 slug는 [slug]폴더 이름이랑 같아야 함 id로 받고 싶으면 [id]이렇게 폴더이름 지정
   
        const searchParams = request.nextUrl.searchParams
 
        const query = searchParams.get('query')
// URL -> `/dashboard?search=my-project`
// `search` -> 'my-project'

        const fetchedTodo = await fetchATodo(params.slug);
        if(fetchedTodo === null){
            return new Response(null, {status : 204})
        }
const response = {
        message: '단일 할 일 가져오기 성공',
        data : fetchedTodo
    }
   return NextResponse.json(response, {status:200});
    // get방식으로 라우팅하면 이게 들어옴
  }


  //할 일 단일 삭제 ID를 받아야함
  export async function DELETE(request: NextRequest , 
    { params }: { params: { slug: string } }) {
//여기에 slug는 [slug]폴더 이름이랑 같아야 함 id로 받고 싶으면 [id]이렇게 폴더이름 지정

      const deletedTodo = await deleteATodo(params.slug);
    
      if (deletedTodo === null){
        return new Response(null, {status:204});
      }
    const response = {
        message: '단일 할 일 삭제 성공',
        data : deletedTodo
    }
   return NextResponse.json(response, {status:200});
    // get방식으로 라우팅하면 이게 들어옴
  }


    //할 일 단일 수정 ID를 받아야함
    export async function POST(request: NextRequest , 
        { params }: { params: { slug: string } }) {
    //여기에 slug는 [slug]폴더 이름이랑 같아야 함 id로 받고 싶으면 [id]이렇게 폴더이름 지정
    const {title, is_done} = await request.json();
   
    const editedTodo =  await editATodo(params.slug, {title, is_done});
    
    if (editedTodo === null){
        return new Response(null, {status:204});
      }
    const response = {
            message: '단일 할 일 수정 성공',
            data : editedTodo
        }
       return NextResponse.json(response, {status:200});
        // get방식으로 라우팅하면 이게 들어옴
      }