let coords = { x: 0.00, y: 0.00, z: 0.00, heading: 0.00, camFov: 50.0 };
let laserOn = false;

const FAV_KEY = 'jcoord_favourites';

function loadFavs() {
    try { return JSON.parse(localStorage.getItem(FAV_KEY)) || []; }
    catch(e) { return []; }
}

function saveFavs(favs) {
    localStorage.setItem(FAV_KEY, JSON.stringify(favs));
}

function escapeHtml(str) {
    return String(str)
        .replace(/&/g,'&amp;')
        .replace(/</g,'&lt;')
        .replace(/>/g,'&gt;')
        .replace(/"/g,'&quot;');
}

function renderFavs() {
    const favs   = loadFavs();
    const $list  = $('#fav-list');
    const $empty = $('#fav-empty');
    const $count = $('#fav-count');

    $count.text(favs.length);
    $list.find('.fav-entry').remove();

    if (favs.length === 0) { $empty.show(); return; }
    $empty.hide();

    favs.forEach(function(fav, idx) {
        const coordStr = `${fav.x}, ${fav.y}, ${fav.z}`;
        const $entry = $(`
            <div class="fav-entry" data-idx="${idx}">
                <span class="fav-star"><i class="fa-solid fa-star"></i></span>
                <div class="fav-info">
                    <div class="fav-entry-name">${escapeHtml(fav.name)}</div>
                    <div class="fav-entry-coords">${coordStr} · H:${fav.heading}</div>
                </div>
                <div class="fav-actions">
                    <button class="fav-copy-btn" title="Copy vector3"><i class="fa-solid fa-clipboard"></i></button>
                    <button class="fav-del-btn"  title="Delete"><i class="fa-solid fa-trash"></i></button>
                </div>
            </div>
        `);

        $entry.find('.fav-copy-btn').on('click', function() {
            copyText(`vector3(${fav.x}, ${fav.y}, ${fav.z})`);
            showToast(`✓ Copied: ${fav.name}`, true);
        });

        $entry.find('.fav-del-btn').on('click', function() {
            const current = loadFavs();
            current.splice(idx, 1);
            saveFavs(current);
            renderFavs();
            showToast('✓ Favourite Deleted', false);
        });

        $list.append($entry);
    });
}

function addFavourite(name) {
    if (!name || !name.trim()) return;
    const favs = loadFavs();
    favs.unshift({
        name:    name.trim(),
        x:       coords.x,
        y:       coords.y,
        z:       coords.z,
        heading: coords.heading,
        camFov:  coords.camFov
    });
    saveFavs(favs);
    renderFavs();
}

window.addEventListener('message', function(event) {
    const data = event.data;

    if (data.action === 'open') {
        updateCoords(data.data);
        showPanel();
    }

    if (data.action === 'close') {
        hidePanel();
    }

    if (data.action === 'updateCoords') {
        updateCoords(data.data);
    }

    if (data.action === 'laserCopy') {
        laserOn = false;
        $('#btn-laser').removeClass('laser-on');

        let text = '';
        let label = '';

        if (data.type === 'vector3') {
            text  = `vector3(${data.x}, ${data.y}, ${data.z})`;
            label = '✓ Vector3 Copied';
        } else if (data.type === 'table') {
            text  = `{${data.x}, ${data.y}, ${data.z}}`;
            label = '✓ {X, Y, Z} Copied';
        } else if (data.type === 'vector4') {
            text  = `vector4(${data.x}, ${data.y}, ${data.z}, ${data.w})`;
            label = '✓ Vector4 Copied';
        }

        copyText(text);
        setTimeout(() => showToast(label, true), 150);
    }
});

function showPanel() { $('#main-panel').addClass('visible'); }
function hidePanel()  { $('#main-panel').removeClass('visible'); }

function updateCoords(data) {
    if (!data) return;
    coords = data;
    $('#val-x').text(data.x);
    $('#val-y').text(data.y);
    $('#val-z').text(data.z);
    $('#val-heading').text(data.heading);
    $('#val-camfov').text(parseFloat(data.camFov).toFixed(1));
}

function postNUI(action, data) {
    $.post(`https://${GetParentResourceName()}/${action}`, JSON.stringify(data));
}

function showToast(msg, success) {
    const $t = $('#toast');
    $t.text(msg);
    if (success) $t.addClass('success'); else $t.removeClass('success');
    $t.addClass('show');
    setTimeout(() => $t.removeClass('show'), 1800);
}

function flashBtn($btn) {
    $btn.addClass('copied');
    setTimeout(() => $btn.removeClass('copied'), 1000);
}

function copyText(text) {
    try {
        const el = document.createElement('textarea');
        el.value = text;
        el.style.position = 'fixed';
        el.style.opacity  = '0';
        document.body.appendChild(el);
        el.focus();
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
    } catch (e) {}
}

$(document).ready(function() {

    $('#close-btn').on('click', function() {
        postNUI('close', {});
        hidePanel();
    });

    $('#btn-vec3').on('click', function() {
        const txt = `vector3(${coords.x}, ${coords.y}, ${coords.z})`;
        copyText(txt);
        flashBtn($(this));
        showToast('✓ Vector3 Copied', true);
    });

    $('#btn-vec4').on('click', function() {
        const txt = `vector4(${coords.x}, ${coords.y}, ${coords.z}, ${coords.heading})`;
        copyText(txt);
        flashBtn($(this));
        showToast('✓ Vector4 Copied', true);
    });

    $('#btn-heading').on('click', function() {
        copyText(`${coords.heading}`);
        flashBtn($(this));
        showToast(`✓ Heading: ${coords.heading}`, true);
    });

    $('#btn-laser').on('click', function() {
        postNUI('toggleLaser', {});
    });

    $('#btn-xyz').on('click', function() {
        const txt = `{${coords.x}, ${coords.y}, ${coords.z}}`;
        copyText(txt);
        flashBtn($(this));
        showToast('✓ {X, Y, Z} Copied', true);
    });

    $('#btn-save').on('click', function() {
        const txt = `{x= ${coords.x}, y= ${coords.y}, z= ${coords.z}}`;
        copyText(txt);
        postNUI('saveCoord', { formatted: txt });
        flashBtn($(this));
        showToast('✓ Saved & Copied!', true);
    });

    $(document).on('keydown', function(e) {
        if (e.key === 'Escape') {
            postNUI('close', {});
            hidePanel();
        }
    });

    renderFavs();

    $('#btn-fav-add').on('click', function() {
        $('#fav-input-row').slideDown(120);
        $('#fav-name-input').val('').focus();
    });

    $('#btn-fav-cancel').on('click', function() {
        $('#fav-input-row').slideUp(120);
    });

    function confirmAddFav() {
        const name = $('#fav-name-input').val().trim();
        if (!name) { $('#fav-name-input').focus(); return; }
        addFavourite(name);
        const txt = `vector3(${coords.x}, ${coords.y}, ${coords.z})`;
        copyText(txt);
        postNUI('saveFav', { name: name, x: coords.x, y: coords.y, z: coords.z, heading: coords.heading });
        $('#fav-input-row').slideUp(120);
        showToast(`Saved: ${name}`, true);
    }

    $('#btn-fav-confirm').on('click', confirmAddFav);

    $('#fav-name-input').on('keydown', function(e) {
        if (e.key === 'Enter') confirmAddFav();
        if (e.key === 'Escape') $('#fav-input-row').slideUp(120);
    });
});
