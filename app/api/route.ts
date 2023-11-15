import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {

    const response = {
        message: '호호호',
        data : '오늘도 화이팅ㅇ'
    }
   return NextResponse.json(response, {status:200});
    // get방식으로 라우팅하면 이게 들어옴
  }