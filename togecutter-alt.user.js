// ==UserScript==
// @name        togecutter-alt
// @namespace   recyclebin5385
// @description togetterの特定ユーザのコメントを見えなくする
// @include     https://togetter.com/li/*
// @include     http://togetter.com/li/*
// @require     https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @version     6.1
// @grant       none
// ==/UserScript==

// Copyright (c) 2017, recyclebin5385
// All rights reserved.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are met:
// * Redistributions of source code must retain the above copyright notice, 
//   this list of conditions and the following disclaimer.
// * Redistributions in binary form must reproduce the above copyright notice, 
//   this list of conditions and the following disclaimer in the documentation 
//   and/or other materials provided with the distribution.
// * Neither the name of the <organization> nor the names of its contributors 
//   may be used to endorse or promote products derived from this software 
//   without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
// ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
// WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
// DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
// DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
// (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
// LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
// ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
// (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
// SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

//
// 説明
// ----
//
// togetterのまとめのコメントのうち、特定のユーザが作成したものをまとめて非表示にします。
//
// 非表示にするには、ユーザ名の隣の×をクリックします。
// 削除済の表示をダブルクリックすると再表示します。
//
//
// 連絡先
// ------
// recyclebin5385[at]yahoo.co.jp ([at]を@に置換してください)
//

jQuery.noConflict()($ => {
    'use strict';
    
    const KEY = 'togecutter-alt-hidden-users';
    
    Object.defineProperty($, 'hiddenUserIds', {
        get() {
            if (Object.prototype.hasOwnProperty.call(localStorage, KEY)) {
                try {
                    return JSON.parse(localStorage[KEY]);
                }
                catch (e) { }
            }
            return [];
        },
        set(ids) {
            const delDups = arr => [...new Set(arr)];
            localStorage[KEY] = JSON.stringify(delDups(ids));
        },
    });

    function addHiddenUserId(id) {
        $.hiddenUserIds = $.hiddenUserIds.concat(id);
    }

    function removeHiddenUserId(id) {
        $.hiddenUserIds = $.hiddenUserIds.filter(e => id !== e);
    }

    function hideUsers() {
        $('#comment_box li').each(function(){
            var listItem = $(this);
            var idLink = listItem.find('a.status_name');
            var id = idLink.text().replace(/^@/, '');

            if ($.hiddenUserIds.includes(id)) {
                listItem.find('.list_tweet_box').hide();
                if (listItem.find('.removed').length == 0) {
                    $(`<span class="removed" title="${id}">[削除済]</span>`)
                        .hide()
                        .css('cursor', 'pointer')
                        .dblclick(function() {
                            if (confirm('このユーザを見えるようにしますか？')) {
                                removeHiddenUserId(id);
                            }
                        })
                        .appendTo(listItem);
                }
                listItem.find('.removed').show();
            } else {
                listItem.find('.list_tweet_box').show();
                listItem.find('.removed').hide();
            }
        });
    }

    $('#comment_box li').each(function(){
        var listItem = $(this);
        var idLink = listItem.find('a.status_name');
        var id = idLink.text().replace(/^@/, '');

        $('<span class="status_name" title="このユーザのコメントを見えなくする">[×]</span>')
            .css('cursor', 'pointer')
            .click(function() {
                if (confirm('このユーザを見えなくしますか？')) {
                    addHiddenUserId(id);
                }
                hideUsers();
                return false;
            })
            .insertAfter(idLink);
    });

    hideUsers();
});
