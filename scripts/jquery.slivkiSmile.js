(function($) {
    var methods = {
        init: function(options) {
            var settings = $.extend({
                'visibleCount': 13,
                'moreButtonText': '<i class="slivki-icon-dot-3"></i>',
                'smilePath': '/images/smile/',
                'smileExtention': '.svg',
                'mobileDevice': false,
                'smileList': '#slivkiSmileList'
            }, options);
            var smileList = $(settings['smileList']).val();
            if (this.length == 0 || !this.is('textarea') || !smileList) {
                return;
            }
            var slivkiSmileBlockClass = 'slivki-smile-block';
            var $textarea = this;
            var slivkiCommentEditorHtml = '<div class="slivki-comment-editor"></div>';
            $textarea.wrap(slivkiCommentEditorHtml);
            var $slivkiCommentEditor = $textarea.parent();
            var editorTextareaHtml = "<div class='slivki-comment-editor-textarea' contenteditable='true'></div>";
            $slivkiCommentEditor.append($(editorTextareaHtml));
            var smileBlockHtml = '<div class="' + slivkiSmileBlockClass + '">' +
                '<div class="slivki-additional-smile-block">' +
                '<a class="more-smile-btn" href="#">' + settings['moreButtonText'] + '</a>' +
                '<div class="slivki-additional-smiles"><div class="slivki-additional-smiles-pane">';
            var $editorTextarea = $slivkiCommentEditor.find('.slivki-comment-editor-textarea');
            $editorTextarea.html($textarea.val().replace(/\n/gi, '<br>'));
            var editorTextarea = $editorTextarea[0];
            smileList = smileList.split(',');
            for (var i = settings['visibleCount']; i < smileList.length; i++) {
                smileBlockHtml += '<img data-name="' + smileList[i] + '" src="' + settings['smilePath'] + smileList[i] + settings['smileExtention'] + '"/>';
            }
            smileBlockHtml += '</div></div></div>';
            for (var i = 0; i < settings['visibleCount']; i++) {
                smileBlockHtml += '<img data-name="' + smileList[i] + '" src="' + settings['smilePath'] + smileList[i] + settings['smileExtention'] + '"/>';
            }
            smileBlockHtml += '</div>';
            var $slivkiSmileBlock = $(smileBlockHtml);
            $slivkiSmileBlock.insertAfter($editorTextarea);
            var $slivkiSmileBlockMoreBtn = $slivkiSmileBlock.find('.more-smile-btn');
            var $additionalSmilesBlock = $slivkiSmileBlock.find('.slivki-additional-smiles');
            $slivkiSmileBlock.find('img').click(function(event) {
                var smileText = $(event.target).data('name');
                if (!smileText) {
                    return false;
                }
                var smileHtml = '<img class="slivki-smile" data-smile="' + smileText + '" src="' + settings['smilePath'] + smileText + settings['smileExtention'] + '" alt=""/>';
                editorTextarea.focus();
                pasteHtmlAtCaret(smileHtml, false);
                $additionalSmilesBlock.removeClass('opened');
                $slivkiSmileBlockMoreBtn.removeClass('opened');
                $editorTextarea.trigger('input');
                return false;
            });
            $slivkiSmileBlockMoreBtn.click(function(event) {
                $additionalSmilesBlock.toggleClass('opened');
                $slivkiSmileBlockMoreBtn.toggleClass('opened');
                return false;
            });
            $editorTextarea.on('input', function() {
                editorTextareaHtml = $editorTextarea.html();
                editorTextareaHtml = editorTextareaHtml.replace(/<div>/ig, "<br>").replace(/<\/div>/ig, "").trim();
                var result = '';
                var lines = editorTextareaHtml.split('<br>');
                for (var i = 0; i < lines.length; i++) {
                    var currentLine = lines[i];
                    var $currentLine = $('<div></div>').append(currentLine);
                    var $currentLineImages = $currentLine.find('img');
                    if ($currentLine.text().trim() == '' && $currentLineImages.length == 1) {
                        $currentLineImages.addClass('big-slivki-smile');
                    } else if ($currentLineImages.length > 1) {
                        $currentLineImages.removeClass('big-slivki-smile');
                    }
                    result = result + $currentLine.html() + '<br>';
                }
                $textarea.val(result);
            });
            if (settings['mobileDevice']) {
                $additionalSmilesBlock.append('<div id="smilesOverlay"></div>');
                $('#smilesOverlay').click(function() {
                    $additionalSmilesBlock.toggleClass('opened');
                    $slivkiSmileBlockMoreBtn.toggleClass('opened');
                    return false;
                });
            } else {
                $('.slivki-additional-smiles-pane').jScrollPane({ autoReinitialise: true });
            }
        }
    };
    $.fn.slivkiSmile = function(method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Метод с именем ' + method + ' не существует для jquery.slivkiSmile');
        }
    };
})(jQuery);