$( ->
    $('#send_msg').bind 'click', ->
        $.post 'save', {content: $('#msg').val()}, (data, textStatus, xhr) ->
            $('div#article_list').prepend data
    
    $('.modify').live 'click', ->
        $(@).removeClass 'modify'
        $(@).addClass 'send_modify'
        $(@).val '送出修改'
        $(@).next().next().next().replaceWith ->
            $('<textarea cols="40" rows="6">' + $(@).html() + '</textarea>')
    
    $('.send_modify').live 'click', ->
        id = $(@).parent().attr 'id'
        content = $(@).next().next().next().val()
        $(@).removeClass 'send_modify'
        $(@).addClass 'modify'
        $(@).val '修改'
        $(@).next().next().next().replaceWith ->
            $('<p>' + $(@).val() + '</p>')
        $.post 'save', {id : id, content: content}, (data, textStatus, xhr) ->
            true
    
    $('.delete').live 'click', ->
        id = $(@).parent().attr 'id'
        $.post 'delete', {id : id}, (data, textStatus, xhr) =>
            $(@).parent().remove()
    
    true
);