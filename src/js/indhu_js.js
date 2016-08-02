function get_senders(allOnlineUsers,text){
    //allOnlineUsers.push("@everyone");
    message = text.split(" ");
    sender_list=[];
    msg_list=[]
    console.log(allOnlineUsers);
    for(var i=0;i<message.length;i++){
        indiv_array_element=message[i];

        if(indiv_array_element.indexOf("@")>-1){
            console.log(indiv_array_element);
            indiv_array_element=indiv_array_element.replace(',','');

            if(allOnlineUsers.indexOf(indiv_array_element)>-1){

                indiv_array_element=indiv_array_element.replace('@','');
                sender_list.push(indiv_array_element);

            }
        }
        else{
            msg_list.push(indiv_array_element);
        }
    }
    //console.log()
    text=msg_list.join(" ");
    //console.log(sender_list);
    return [text,sender_list];
}
