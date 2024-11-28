

export const UseSocket=(url:string)=>{
  if(url){
    const socket=new WebSocket(url);
    socket.onopen=()=>{
        socket.send("Hello, connection established!");
      console.log("connections established !")
    }
    socket.onerror = (wsError) => {
        console.error("WebSocket error:", wsError);
      };

      socket.onclose = () => {
        console.log("WebSocket connection closed.");
      };
  }else{
    console.error("WebSocket URL missing.");
  }
  
}